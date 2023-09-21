package com.example.kakaotalk.controllers;

import com.example.kakaotalk.entities.*;
import com.example.kakaotalk.enums.*;
import com.example.kakaotalk.services.UserService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.MessagingException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping(value = "/user")
public class UserController {
    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    //이메일 중복 체크
    @RequestMapping(value = "emailCount",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getEmailCount(@RequestParam(value = "email") String email) {
        CheckEmailResult result = this.userService.checkEmail(email);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    //최종 회원가입 요청
    @RequestMapping(value = "register",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRegister(UserEntity user,
                               RegisterContactCodeEntity registerContactCode) throws MessagingException, IOException {

        RegisterResult result = this.userService.register(user, registerContactCode);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        //회원가입 성공시 프로필 할당

        if(result == RegisterResult.SUCCESS){
            this.userService.defaultProfile(registerContactCode.getContact());
        }

        return responseObject.toString();
    }

    //인증번호 보내기
    @RequestMapping(value = "contactCode",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getContactCode(RegisterContactCodeEntity registerContactCode) {
        SendRegisterContactCodeResult result = this.userService.sendRegisterContactCode(registerContactCode);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        if (result == SendRegisterContactCodeResult.SUCCESS) {
            responseObject.put("salt", registerContactCode.getSalt());
        }
        return responseObject.toString();
    }

    //인증번호 확인
    @RequestMapping(value = "contactCode",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchContactCode(RegisterContactCodeEntity registerContactCode) {
        VerifyRegisterContactCodeResult result = this.userService.verifyRegisterContactCode(registerContactCode);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    //이메일인증확인
    @RequestMapping(value = "emailCode",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getEmailCode(RegisterEmailCodeEntity registerEmailCode) {
        VerifyRegisterEmailCodeResult result = this.userService.verifyRegisterEmailCode(registerEmailCode);
        return new ModelAndView() {{
            setViewName("home/emailCode");
            addObject("result", result.name());
        }};
    }

    //로그인
    @RequestMapping(value = "login",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String login(HttpServletResponse response, UserEntity user, @CookieValue(name = "jwtToken", required = false) String jwtValue) {
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.TRUE){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        LoginResult result = this.userService.login(user);
        if (result == LoginResult.SUCCESS) {
            //로그인이 완료 되었으므로 jwt 쿠키 인증 HttpOnly로 자바스크립트 접근 차단
            response.setHeader("Set-Cookie", "jwtToken=" + this.userService.jwtUtil(user.getContact()) + "; Path=/; HttpOnly");
        }
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    //유저 프로필
    @RequestMapping(value = "getProfile",
                    method = RequestMethod.GET,
                    produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getUserProfile(@CookieValue(name = "jwtToken") String jwtValue,
                                 @RequestParam(name = "contact", required = false)String contact) throws InterruptedException {

        Thread.sleep(500);
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.NULL || check == ClientJwtResult.FALSE){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        UserProfileEntity result;

        if(contact != null){
            result = this.userService.getUserProfile(jwtValue, contact);
        }else{
            result = this.userService.getUserProfile(jwtValue, null);
        }
        System.out.println(result.getProfileMainImg()+"잘뜸?");
        JSONObject responseObject = new JSONObject();
        responseObject.put("nickname", result.getProfileNickname());
        responseObject.put("profileText", result.getProfileText());
        responseObject.put("profileContact", result.getContact());
        responseObject.put("profileMainImg", result.getProfileMainImg());
        responseObject.put("profileBackgroundImg", result.getProfileBackgroundImg());
        return responseObject.toString();
    }

    @RequestMapping(value = "getFriendList",
                    method = RequestMethod.GET,
                    produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getUserFriend(@CookieValue(name = "jwtToken") String jwtValue) throws InterruptedException {
        Thread.sleep(600);

        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.NULL || check == ClientJwtResult.FALSE){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }

        UserProfileEntity[] result = this.userService.getFriendList(jwtValue);
        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < result.length; i++) {
            JSONObject friendObject = new JSONObject();
            friendObject.put("contact", result[i].getContact());
            friendObject.put("profileMainImg", result[i].getProfileMainImg());
            friendObject.put("profileBackgroundImg", result[i].getProfileBackgroundImg());
            friendObject.put("profileText", result[i].getProfileText());
            friendObject.put("profileNickname", result[i].getProfileNickname());
            jsonArray.put(friendObject);
        }

        JSONObject responseObject = new JSONObject();
        responseObject.put("result", jsonArray);
        return responseObject.toString();
    }

    //쿠키에 jwtToken이 있는지 확인 HttpOnly 설정 값 때문에 서버에서 확인 해야 한다
    //jtwToken이 있는지 유효한지 확인
    @RequestMapping(value = "loginCheck",
            method = RequestMethod.GET)
    @ResponseBody
    public String loginCheck(@CookieValue(name = "jwtToken", required = false) String jwtValue){
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        JSONObject responseObject = new JSONObject(){{
            put("result", check.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    @RequestMapping(value = "patchProfile",
                method = RequestMethod.PATCH)
    @ResponseBody
    public String patchProfile(@CookieValue(name = "jwtToken", required = false) String jwtValue,
                               UserProfileEntity userProfileEntity){
        //요청하기전에 유효한 jwt토큰인지 체크
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.FALSE || check == ClientJwtResult.NULL){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }

        if(userProfileEntity.getProfileText()=="" || userProfileEntity.getProfileNickname()==""){
            JSONObject responseObject = new JSONObject(){{
                put("result", "value_null");
            }};
            return responseObject.toString();
        }

        ProfileEditResult result = this.userService.patchProfile(jwtValue, userProfileEntity);
        JSONObject responseObject = new JSONObject(){{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    };
    @RequestMapping(value = "patchProfile",
                    method = RequestMethod.POST,
            produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String patchProfile( HttpServletRequest request,
                                @CookieValue(name = "jwtToken", required = false) String jwtValue,
                                @RequestParam(name = "profileMainImg", required = false) MultipartFile profileMainImg,
                                @RequestParam(name = "profileBackgroundImg", required = false) MultipartFile profileBackgroundImg){
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.FALSE || check == ClientJwtResult.NULL){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }

        ProfileEditResult result = this.userService.patchProfileImage(jwtValue, profileMainImg, profileBackgroundImg);
        JSONObject responseObject = new JSONObject(){{
           put("result", result);
        }};
        return responseObject.toString();
    }
    @RequestMapping(value = "patchFriendNickname",
                    method = RequestMethod.PATCH,
                    produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String patchFriendStatus(@CookieValue(name = "jwtToken", required = false) String jwtValue,
                                    UserFriendListEntity userFriendList){
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.FALSE || check == ClientJwtResult.NULL){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        StatusResult result = this.userService.patchFriendStatus(jwtValue, userFriendList);
        JSONObject responseObject = new JSONObject(){{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    @RequestMapping(value = "toggleFriendStatus",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String friendStatus(@CookieValue(name = "jwtToken", required = false) String jwtValue,
                               @RequestParam(name = "contactFriend")String contactFriend){
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.FALSE || check == ClientJwtResult.NULL){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        StatusResult result = this.userService.toggleFriendStatus(jwtValue, contactFriend);
        JSONObject responseObject = new JSONObject(){{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }


    @RequestMapping(value = "searchFriend",
                method = RequestMethod.GET,
                produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String searchFriend(@CookieValue(name = "jwtToken", required = false) String jwtValue, UserEntity userEntity){
        //요청하기전에 유효한 jwt토큰인지 체크
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.FALSE || check == ClientJwtResult.NULL){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        //만약에 검색한 값과 로그인한 값이 일치하면 self 리턴
        UserEntity check2 = this.userService.getUserEntity(jwtValue);

        if(userEntity.getContact()!=null&&userEntity.getName()!=null){
            if (check2.getContact().equals(userEntity.getContact()) && check2.getName().equals(userEntity.getName())) {
                JSONObject responseObject = new JSONObject() {{
                    put("result", "self");
                }};
                return responseObject.toString();
            }
        }
        if(userEntity.getEmail()!=null){
            if(check2.getEmail().equals(userEntity.getEmail())){
                JSONObject responseObject = new JSONObject() {{
                    put("result", "self");
                }};
                return responseObject.toString();
            }
        }
        //contact와 name을 전달후 검색 실행 후 없으면 null 리턴, 있으면 프로필 리턴
        UserEntity contact = this.userService.searchFriend(userEntity);
        if(contact == null){
            JSONObject responseObject = new JSONObject(){{
                put("result", "search_null");
            }};
            return responseObject.toString();
        }

        //친구 추가 성공
        JSONObject responseObject = new JSONObject();
        StatusResult result2 = this.userService.addFriend(check2.getContact(), contact.getContact());
        if(result2 == StatusResult.SUCCESS){
            UserProfileEntity result = this.userService.getFriendProfile(contact.getContact());
            responseObject.put("friend_nickname", result.getProfileNickname());
            responseObject.put("friend_profileText", result.getProfileText());
            responseObject.put("friend_profileMainImg", result.getProfileMainImg());
            return responseObject.toString();
        };
        //친구 추가 실패
        responseObject.put("result", result2.name().toLowerCase());
        return responseObject.toString();
    }

    //jwtToken을 지워줌, HttpOnly라서 서버에서 처리해야함
    @RequestMapping(value = "logout",
                    method = RequestMethod.GET,
                    produces = MediaType.APPLICATION_JSON_VALUE)
    public void logout(HttpServletResponse response){
        Cookie jwtCookie = new Cookie("jwtToken", null);
        jwtCookie.setMaxAge(0);
        jwtCookie.setPath("/");
        jwtCookie.setHttpOnly(true);
        response.addCookie(jwtCookie);
    }
    @RequestMapping(value = "contactCodeRec",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchContactCodeRec(RecoverContactCodeEntity recoverContactCode) {
        VerifyRecoverContactCodeResult result = this.userService.recoverContactCodeResult(recoverContactCode);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        if (result == VerifyRecoverContactCodeResult.SUCCESS) {
            UserEntity user = this.userService.getUserByContact(recoverContactCode.getContact());
            responseObject.put("email", user.getEmail());
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "contactCodeRec",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getContactCodeRec(RecoverContactCodeEntity recoverContactCode) {
        SendRecoverContactCodeResult result = this.userService.sendRecoverContactCode(recoverContactCode);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        if (result == SendRecoverContactCodeResult.SUCCESS) {
            responseObject.put("salt", recoverContactCode.getSalt());
        }
        return responseObject.toString();
    }
    @RequestMapping(value = "recoverPassword",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRecoverPassword(RecoverEmailCodeEntity recoverEmailCode) throws MessagingException {
        SendRecoverEmailCodeResult result = this.userService.sendRecoverEmailCode(recoverEmailCode);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    @RequestMapping(value = "recoverPassword",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRecoverPassword(RecoverEmailCodeEntity recoverEmailCode) {
        VerifyRecoverEmailCodeResult result = this.userService.verifyRecoverEmailCode(recoverEmailCode);
        ModelAndView modelAndView = new ModelAndView("home/recoverPassword");
        modelAndView.addObject("result", result.name().toLowerCase());
        modelAndView.addObject("recoverEmailCode", recoverEmailCode);
        return modelAndView;
    }
    @RequestMapping(value = "recoverPassword",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRecoverPassword(RecoverEmailCodeEntity recoverEmailCode, UserEntity user) {
        RecoverPasswordResult result = this.userService.recoverPassword(recoverEmailCode, user);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }
}
