package com.example.kakaotalk.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.kakaotalk.entities.*;
import com.example.kakaotalk.enums.*;
import com.example.kakaotalk.mappers.UserMapper;
import com.example.kakaotalk.utils.CryptoUtil;
import com.example.kakaotalk.utils.JwtUtil;
import com.example.kakaotalk.utils.NCloudUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Service
public class UserService {
    private final UserMapper userMapper;
    private JavaMailSender javaMailSender;
    private final SpringTemplateEngine springTemplateEngine;
    @Value("${spring.web.resources.static-locations}")
    private String staticLocations;

    @Autowired
    public UserService(UserMapper userMapper, JavaMailSender javaMailSender, SpringTemplateEngine springTemplateEngine, ResourceLoader resourceLoader) {
        this.userMapper = userMapper;
        this.javaMailSender = javaMailSender;
        this.springTemplateEngine = springTemplateEngine;
    }
    
    //이메일 있나 체크하는 메소드
    public CheckEmailResult checkEmail(String email) {
        //RegisterEmailCodeEntity에 5분이 지난 메일이 있는가 체크
        return this.userMapper.selectUserByEmail(email) == null
                ? CheckEmailResult.OKAY
                : CheckEmailResult.DUPLICATE;
    }

    
    //휴대폰 인증번호를 전송하는 메소드
    public SendRegisterContactCodeResult sendRegisterContactCode(RegisterContactCodeEntity registerContactCode){
        
        //값이 잘 넘어왔는가 정규식이 맞나 확인
        if (registerContactCode == null ||
                registerContactCode.getContact() == null ||
                !registerContactCode.getContact().matches("^(010)(\\d{8})$")) {
            return SendRegisterContactCodeResult.FAILURE;
        }
        //이미 있는 번호인지 확인
        if (this.userMapper.selectUserByContact(registerContactCode.getContact()) != null) {
            return SendRegisterContactCodeResult.FAILURE_DUPLICATE;
        }
        
        //인증번호, 유효성을 체크하기 위한 salt 만듬
        String code = RandomStringUtils.randomNumeric(6);
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                registerContactCode.getContact(),
                code,
                Math.random(),
                Math.random()));
        Date createdAt = new Date();
        Date expiresAt = DateUtils.addMinutes(createdAt, 5);
        
        registerContactCode.setCode(code)
                .setSalt(salt)
                .setCreatedAt(createdAt)
                .setExpiresAt(expiresAt)
                .setExpired(false);
        NCloudUtil.sendSms(registerContactCode.getContact(), String.format("[짭카오톡] 인증번호 [%s]를 입력해 주세요.", registerContactCode.getCode()));
        
        //DB에 인증번호 보낼 때 사용된 번호와 코드 salt 넣기
        return this.userMapper.insertRegisterContactCode(registerContactCode) > 0
                ? SendRegisterContactCodeResult.SUCCESS
                : SendRegisterContactCodeResult.FAILURE;
    }

    public VerifyRegisterContactCodeResult verifyRegisterContactCode(RegisterContactCodeEntity registerContactCode) {
        //code(인증번호)와 함께 받은 code와 contact로 where 하여 나머지 정보를 불러옴
        registerContactCode = this.userMapper.selectRegisterContactCodeByContactCodeSalt(registerContactCode);

        //빈 값이면 틀린 인증번호 이므로 faiure
        if (registerContactCode == null) {
            return VerifyRegisterContactCodeResult.FAILURE;
        }

        //getExpiresAt()는 db에 코드 생성과 함께 생성시간+5분의 정보가 담김 이를통해 5분 유효시간을 비교함
        if (new Date().compareTo(registerContactCode.getExpiresAt()) > 0) {
            return VerifyRegisterContactCodeResult.FAILURE_EXPIRED;
        }

        //모두 통과하면 인증했다는 의미로 true 반환
        registerContactCode.setExpired(true);


        return this.userMapper.updateRegisterContactCode(registerContactCode) > 0
                ? VerifyRegisterContactCodeResult.SUCCESS
                : VerifyRegisterContactCodeResult.FAILURE;
    }
    
    //회원가입 후 인증메일을 보내는 코드
    public RegisterResult register(UserEntity user, RegisterContactCodeEntity registerContactCode) throws
            MessagingException {
        if (this.userMapper.selectUserByEmail(user.getEmail()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_EMAIL;
        }
        if (this.userMapper.selectUserByContact(user.getContact()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_CONTACT;
        }
        if (this.userMapper.selectUserByName(user.getName()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_NAME;
        }

        registerContactCode = this.userMapper.selectRegisterContactCodeByContactCodeSalt(registerContactCode);

        if (registerContactCode == null || !registerContactCode.isExpired()) {
            return RegisterResult.FAILURE;
        }

        user.setPassword(CryptoUtil.hashSha512(user.getPassword()));
        user.setStatus("EMAIL_PENDING");
        user.setAdmin(false);

        RegisterEmailCodeEntity registerEmailCode = new RegisterEmailCodeEntity();
        registerEmailCode.setEmail(user.getEmail());
        registerEmailCode.setCode(RandomStringUtils.randomAlphanumeric(6));
        registerEmailCode.setSalt(CryptoUtil.hashSha512(String.format("%s%s%f%f",
                registerEmailCode.getEmail(),
                registerEmailCode.getCode(),
                Math.random(),
                Math.random())));
        registerEmailCode.setCreatedAt(new Date());
        registerEmailCode.setExpiresAt(DateUtils.addHours(registerEmailCode.getCreatedAt(), 1));
        registerEmailCode.setExpired(false);

        String url = String.format("https://jjab.jjh1605107.co.kr/user/emailCode?email=%s&code=%s&salt=%s",
                registerEmailCode.getEmail(),
                registerEmailCode.getCode(),
                registerEmailCode.getSalt());
        Context context = new Context();
        context.setVariable("url", url);

        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        mimeMessageHelper.setSubject("[짭카오톡] 이메일 인증");
        mimeMessageHelper.setFrom("inst.jjh1605107@gmail.com"); 
        mimeMessageHelper.setTo(user.getEmail());
        mimeMessageHelper.setText(this.springTemplateEngine.process("_registerEmail", context), true);
        this.javaMailSender.send(mimeMessage);

        return this.userMapper.insertUser(user) > 0 && this.userMapper.insertRegisterEmailCode(registerEmailCode) > 0
                ? RegisterResult.SUCCESS
                : RegisterResult.FAILURE;
    }
    
    //외부에서 이메일 인증을 확인하는 메소드
    public VerifyRegisterEmailCodeResult verifyRegisterEmailCode(RegisterEmailCodeEntity registerEmailCode) {
        if (registerEmailCode.getEmail() == null ||
                registerEmailCode.getCode() == null ||
                registerEmailCode.getSalt() == null ||
                !registerEmailCode.getEmail().matches("^(?=.{10,50}$)([\\da-zA-Z\\-_.]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$") ||
                !registerEmailCode.getCode().matches("^([\\da-zA-Z]{6})$") ||
                !registerEmailCode.getSalt().matches("^([\\da-f]{128})")) {
            return VerifyRegisterEmailCodeResult.FAILURE;
        }
        registerEmailCode = this.userMapper.selectRegisterEmailCodeByEmailCodeSalt(registerEmailCode);
        if (registerEmailCode == null) {
            return VerifyRegisterEmailCodeResult.FAILURE;
        }
        if (new Date().compareTo(registerEmailCode.getExpiresAt()) > 0) {
             //5분 지났으니 이메일을 삭제하자
            this.userMapper.deleteUser(registerEmailCode.getEmail());
            return VerifyRegisterEmailCodeResult.FAILURE_EXPIRED;
        }
        registerEmailCode.setExpired(true);
        UserEntity user = this.userMapper.selectUserByEmail(registerEmailCode.getEmail());
        user.setStatus("OKAY");
        return this.userMapper.updateRegisterEmailCode(registerEmailCode) > 0 && this.userMapper.updateUser(user) > 0
                ? VerifyRegisterEmailCodeResult.SUCCESS
                : VerifyRegisterEmailCodeResult.FAILURE;
    }

    public void defaultProfile(String contact) {
        this.userMapper.defaultProfile(contact);
    }


    //받은 유저 이메일로 select 후 비밀번호 비교
    public LoginResult login(UserEntity user) {
        if (user.getEmail() == null ||
                user.getPassword() == null ||
                !user.getEmail().matches("^(?=.{10,50}$)([\\da-zA-Z\\-_.]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$") ||
                !user.getPassword().matches("^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]};:'\",<.>/?]{8,50})$")) {
            return LoginResult.FAILURE;
        }
        UserEntity existingUser = this.userMapper.selectUserByEmail(user.getEmail());
        if (existingUser == null) {
            return LoginResult.FAILURE;
        }
        user.setPassword(CryptoUtil.hashSha512(user.getPassword()));
        if (!user.getPassword().equals(existingUser.getPassword())) {
            return LoginResult.FAILURE;
        }
        user.setName(existingUser.getName())
                .setContact(existingUser.getContact())
                .setStatus(existingUser.getStatus())
                .setAdmin(existingUser.isAdmin())
                .setRegisteredAt(existingUser.getRegisteredAt());
        if (user.getStatus().equals("DELETED")) {
            return LoginResult.FAILURE;
        }
        if (user.getStatus().equals("EMAIL_PENDING")) {
            return LoginResult.FAILURE_EMAIL_NOT_VERIFIED;
        }
        if (user.getStatus().equals("SUSPENDED")) {
            return LoginResult.FAILURE_SUSPENDED;
        }
        return LoginResult.SUCCESS;
    }
    //로그인 시
    //유저 contact를 받아서 jwt토큰 생성 후 리턴
    public String jwtUtil(String contact) {
        return JwtUtil.jwtUtil(contact);
    }
    
    //클라이언트에 jwt토큰이 있는지 유효한지 확인
    public ClientJwtResult jwtCheck(String jwtValue){
        if(jwtValue == null){
            return ClientJwtResult.NULL;
        }
        return JwtUtil.jwtCheck(jwtValue) == true ? ClientJwtResult.TRUE : ClientJwtResult.FALSE;
    }

    //로그인된 유저의 프로필 정보를 가져옴
    @Transactional
    public UserProfileEntity getUserProfile(String jwtValue, String friendContact){
        String contact = JwtUtil.jwtUser(jwtValue);
        //친구정보가 있고 토큰값이 비어있지 않는경우(정상적인 jwt토큰일 경우)
        if(friendContact!=null && contact!=null){
            return this.userMapper.selectUserProfileByContact(friendContact);
        }
        //친구정보가 비어있으면 내 정보 리턴
        return this.userMapper.selectUserProfileByContact(contact);
    }
    public UserProfileEntity getFriendProfile(String contact){
        return this.userMapper.selectUserProfileByContact(contact);
    }
    public UserEntity getUserEntity(String jwtValue){
        String contact = JwtUtil.jwtUser(jwtValue);
        return this.userMapper.selectUserByContact(contact);
    }
    //jwt토큰이 유효한지 체크후 프로필 파일 수정
    public ProfileEditResult patchProfile(String jwtValue, UserProfileEntity userProfileEntity) {
        if(JwtUtil.jwtCheck(jwtValue) == false){
            return ProfileEditResult.FAILURE;
        }
        String contact = JwtUtil.jwtUser(jwtValue);
        UserProfileEntity defaultUser = this.userMapper.selectUserProfileByContact(contact);
        if(userProfileEntity.getProfileNickname() == null){
            userProfileEntity.setProfileNickname(defaultUser.getProfileNickname());
        }
        if(userProfileEntity.getProfileText() == null){
            userProfileEntity.setProfileText(defaultUser.getProfileText());
        }
        userProfileEntity.setContact(contact);
        this.userMapper.updateUserProfileText(userProfileEntity);
        return ProfileEditResult.SUCCESS;
    }
    public UserEntity searchFriend(UserEntity userEntity){
        return this.userMapper.searchFriend(userEntity);
    }

    public StatusResult addFriend(String userContact, String contactFriend) {
        UserFriendListEntity[] contacts = this.userMapper.selectFriendContactList(userContact);
        for(int i = 0; i < contacts.length; i++) {
            if (contacts[i].getContactFriend().equals(contactFriend)){
                return StatusResult.DUPLICATE;
            }
        }
        return this.userMapper.addFriend(userContact, contactFriend) > 0 ?
                StatusResult.SUCCESS : StatusResult.FAILURE;
    }

    public ProfileEditResult patchProfileImage(String jwtValue, MultipartFile profileMainImg, MultipartFile profileBackgroundImg) {
        String contact = JwtUtil.jwtUser(jwtValue);
        UserProfileEntity selectUpdateUser = this.userMapper.selectUserProfileByContact(contact);
        try {
            if (profileMainImg != null) {
                selectUpdateUser.setProfileMainImg(profileMainImg.getBytes());
                selectUpdateUser.setProfileMainImgSize((int) profileMainImg.getSize());
                selectUpdateUser.setProfileMainImgContentType(profileMainImg.getContentType());
            }
            if (profileBackgroundImg != null) {
                selectUpdateUser.setProfileBackgroundImg(profileBackgroundImg.getBytes());
                selectUpdateUser.setProfileBackgroundImgSize((int) profileBackgroundImg.getSize());
                selectUpdateUser.setProfileBackgroundImgContentType(profileBackgroundImg.getContentType());
            }
            return this.userMapper.updateUserProfileImage(selectUpdateUser) > 0 ? ProfileEditResult.SUCCESS : ProfileEditResult.FAILURE;
        } catch (Exception e) {
            return ProfileEditResult.FAILURE;
        }
    }

    public UserProfileEntity[] getFriendList(String jwtValue){
        String contact = JwtUtil.jwtUser(jwtValue);
        //추가된 친구 contact 검색
        UserFriendListEntity[] contacts = this.userMapper.selectFriendContactList(contact);
        //검색된 친구 contact들을 가지고 다시 프로필 검색 후 반환
        UserProfileEntity[] friendList = new UserProfileEntity[contacts.length];
        for(int i = 0; i < contacts.length; i++){
            friendList[i] = this.userMapper.selectUserProfileByContact(contacts[i].getContactFriend());
            //만약에 유저가 친구의 이름을 변경했따면? (0보다 크면?)
            if(contacts[i].getUserFriendNameEdit().length() != 0){
                friendList[i].setProfileNickname(contacts[i].getUserFriendNameEdit());
            }
        }
        return friendList;
    }
    public StatusResult patchFriendStatus(String jwtValue, UserFriendListEntity userFriendList) {
        String contact = JwtUtil.jwtUser(jwtValue);
        userFriendList.setContact(contact);
        return this.userMapper.updateFriendNickname(userFriendList) > 0 ? StatusResult.SUCCESS : StatusResult.FAILURE;
    }

    public StatusResult toggleFriendStatus(String jwtValue, String contactFriend) {
        String contact = JwtUtil.jwtUser(jwtValue);
        return this.userMapper.toggleFriendStatus(contact, contactFriend) > 0 ? StatusResult.SUCCESS : StatusResult.FAILURE;
    }









    public SendRecoverContactCodeResult sendRecoverContactCode(RecoverContactCodeEntity recoverContactCode) {
        if (recoverContactCode == null ||
                recoverContactCode.getContact() == null ||
                !recoverContactCode.getContact().matches("^(010\\d{8})$")) {
            return SendRecoverContactCodeResult.FAILURE;
        }
        UserEntity existingUser = this.userMapper.selectUserByContact(recoverContactCode.getContact());
        if (existingUser == null) {
            return SendRecoverContactCodeResult.FAILURE;
        }
        recoverContactCode
                .setCode(RandomStringUtils.randomNumeric(6))
                .setSalt(CryptoUtil.hashSha512(String.format("%s%s%f%f",
                        recoverContactCode.getCode(),
                        recoverContactCode.getContact(),
                        Math.random(),
                        Math.random())))
                .setCreatedAt(new Date())
                .setExpiresAt(DateUtils.addMinutes(recoverContactCode.getCreatedAt(), 5))
                .setExpired(false);
        NCloudUtil.sendSms(recoverContactCode.getContact(), String.format("[짭카오톡 이메일 찾기] 인증번호 [%s]를 입력해 주세요.", recoverContactCode.getCode()));
        return this.userMapper.insertRecoverContactCode(recoverContactCode) > 0
                ? SendRecoverContactCodeResult.SUCCESS
                : SendRecoverContactCodeResult.FAILURE;
    }
    public SendRecoverEmailCodeResult sendRecoverEmailCode(RecoverEmailCodeEntity recoverEmailCode) throws MessagingException {
        if (recoverEmailCode == null ||
                recoverEmailCode.getEmail() == null ||
                !recoverEmailCode.getEmail().matches("^(?=.{10,50}$)([\\da-zA-Z\\-_\\.]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$")) {
            return SendRecoverEmailCodeResult.FAILURE;
        }
        if (this.userMapper.selectUserByEmail(recoverEmailCode.getEmail()) == null) {
            return SendRecoverEmailCodeResult.FAILURE;
        }
        recoverEmailCode
                .setCode(RandomStringUtils.randomAlphanumeric(6))
                .setSalt(CryptoUtil.hashSha512(String.format("%s%s%f%f",
                        recoverEmailCode.getCode(),
                        recoverEmailCode.getEmail(),
                        Math.random(),
                        Math.random())))
                .setCreatedAt(new Date())
                .setExpiresAt(DateUtils.addHours(recoverEmailCode.getCreatedAt(), 1))
                .setExpired(false);
        String url = String.format("https://jjab.jjh1605107.co.kr/user/recoverPassword?email=%s&code=%s&salt=%s",
                recoverEmailCode.getEmail(),
                recoverEmailCode.getCode(),
                recoverEmailCode.getSalt());
        Context context = new Context();
        context.setVariable("url", url);

        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        mimeMessageHelper.setSubject("[짭카오톡 비밀번호 재설정] 이메일 인증");
        mimeMessageHelper.setFrom("inst.jjh1605107@gmail.com");
        mimeMessageHelper.setTo(recoverEmailCode.getEmail());
        mimeMessageHelper.setText(this.springTemplateEngine.process("_recoverEmail", context), true);
        this.javaMailSender.send(mimeMessage);

        return this.userMapper.insertRecoverEmailCode(recoverEmailCode) > 0
                ? SendRecoverEmailCodeResult.SUCCESS
                : SendRecoverEmailCodeResult.FAILURE;
    }

    public VerifyRecoverEmailCodeResult verifyRecoverEmailCode(RecoverEmailCodeEntity recoverEmailCode) {
        if (recoverEmailCode == null ||
                recoverEmailCode.getEmail() == null ||
                recoverEmailCode.getCode() == null ||
                recoverEmailCode.getSalt() == null ||
                !recoverEmailCode.getEmail().matches("^(?=.{10,50}$)([\\da-zA-Z\\-_\\.]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$") ||
                !recoverEmailCode.getCode().matches("^([\\da-zA-Z]{6})$") ||
                !recoverEmailCode.getSalt().matches("^([\\da-f]{128})$")) {
            return VerifyRecoverEmailCodeResult.FAILURE;
        }
        recoverEmailCode = this.userMapper.selectRecoverEmailCodeByEmailCodeSalt(recoverEmailCode);
        if (recoverEmailCode == null) {
            return VerifyRecoverEmailCodeResult.FAILURE;
        }
        if (new Date().compareTo(recoverEmailCode.getExpiresAt()) > 0) {
            return VerifyRecoverEmailCodeResult.FAILURE_EXPIRED;
        }
        recoverEmailCode.setExpired(true);
        return this.userMapper.updateRecoverEmailCode(recoverEmailCode) > 0
                ? VerifyRecoverEmailCodeResult.SUCCESS
                : VerifyRecoverEmailCodeResult.FAILURE;
    }

    public RecoverPasswordResult recoverPassword(RecoverEmailCodeEntity recoverEmailCode, UserEntity user) {
        if (recoverEmailCode == null ||
                recoverEmailCode.getEmail() == null ||
                recoverEmailCode.getCode() == null ||
                recoverEmailCode.getSalt() == null ||
                user == null ||
                user.getPassword() == null) {
            return RecoverPasswordResult.FAILURE;
        }
        recoverEmailCode = this.userMapper.selectRecoverEmailCodeByEmailCodeSalt(recoverEmailCode);
        if (recoverEmailCode == null || !recoverEmailCode.isExpired()) {
            return RecoverPasswordResult.FAILURE;
        }
        String newPassword = CryptoUtil.hashSha512(user.getPassword());
        user = this.userMapper.selectUserByEmail(user.getEmail());
        if (user == null) {
            return RecoverPasswordResult.FAILURE;
        }
        user.setPassword(newPassword);
        return this.userMapper.updateUser(user) > 0 && this.userMapper.deleteRecoverEmailCode(recoverEmailCode) > 0
                ? RecoverPasswordResult.SUCCESS
                : RecoverPasswordResult.FAILURE;
    }
    public VerifyRecoverContactCodeResult recoverContactCodeResult(RecoverContactCodeEntity recoverContactCode) {
        if (recoverContactCode == null ||
                recoverContactCode.getContact() == null ||
                recoverContactCode.getCode() == null ||
                recoverContactCode.getSalt() == null ||
                !recoverContactCode.getContact().matches("^(010\\d{8})$") ||
                !recoverContactCode.getCode().matches("^(\\d{6})$") ||
                !recoverContactCode.getSalt().matches("^([\\da-f]{128})$")) {
            return VerifyRecoverContactCodeResult.FAILURE;
        }
        recoverContactCode = this.userMapper.selectRecoverContactCodeByContactCodeSalt(recoverContactCode);
        if (recoverContactCode == null) {
            return VerifyRecoverContactCodeResult.FAILURE;
        }
        if (new Date().compareTo(recoverContactCode.getExpiresAt()) > 0) {
            return VerifyRecoverContactCodeResult.FAILURE_EXPIRED;
        }
        recoverContactCode.setExpired(true);
        return this.userMapper.updateRecoverContactCode(recoverContactCode) > 0
                ? VerifyRecoverContactCodeResult.SUCCESS
                : VerifyRecoverContactCodeResult.FAILURE_EXPIRED;
    }
    public UserEntity getUserByContact(String contact) {
        return this.userMapper.selectUserByContact(contact);
    }
}
