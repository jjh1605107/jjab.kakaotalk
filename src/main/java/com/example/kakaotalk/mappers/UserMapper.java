package com.example.kakaotalk.mappers;

import com.example.kakaotalk.entities.*;
import com.example.kakaotalk.enums.SendRecoverContactCodeResult;
import com.example.kakaotalk.enums.SendRecoverEmailCodeResult;
import com.example.kakaotalk.enums.VerifyRecoverContactCodeResult;
import com.example.kakaotalk.enums.VerifyRecoverEmailCodeResult;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    UserEntity selectUserByEmail(@Param(value = "email") String email);
    UserEntity selectUserByName(@Param(value = "name") String name);
    UserEntity selectUserByContact(@Param(value = "contact")String contact);
    UserProfileEntity selectUserProfileByContact(@Param(value = "contact")String contact);
    int insertUser(UserEntity user);
    int insertRegisterEmailCode(RegisterEmailCodeEntity registerEmailCode);
    int insertRegisterContactCode(RegisterContactCodeEntity registerContactCode);
    RegisterContactCodeEntity selectRegisterContactCodeByContactCodeSalt(RegisterContactCodeEntity registerContactCode);
    int updateRegisterContactCode(RegisterContactCodeEntity registerContactCode);
    RegisterEmailCodeEntity selectRegisterEmailCodeByEmailCodeSalt(RegisterEmailCodeEntity registerEmailCode);
    int updateRegisterEmailCode(RegisterEmailCodeEntity registerEmailCode);
    int updateUser(UserEntity user);
    int deleteUser(@Param(value = "email")String email);
    int defaultProfile(@Param(value = "contact")String contact);

    int updateUserProfileImage(UserProfileEntity userProfileEntity);
    int updateUserProfileText(UserProfileEntity userProfileEntity);


    UserEntity searchFriend(UserEntity userEntity);
    int addFriend(@Param(value = "userContact")String userContact,
                  @Param(value = "friendContact")String friendContact);
    UserFriendListEntity[] selectFriendContactList(@Param(value = "contact")String contact);
    int updateFriendNickname(UserFriendListEntity userFriendList);
    int toggleFriendStatus(@Param(value="contact")String contact, @Param(value = "contactFriend")String contactFriend);
    UserFriendListEntity selectFriendContactStatus(@Param(value = "contact") String contact);
    int insertRecoverEmailCode(RecoverEmailCodeEntity recoverEmailCode);
    RecoverEmailCodeEntity selectRecoverEmailCodeByEmailCodeSalt(RecoverEmailCodeEntity recoverEmailCode);
    int updateRecoverEmailCode(RecoverEmailCodeEntity recoverEmailCode);
    int deleteRecoverEmailCode(RecoverEmailCodeEntity recoverEmailCode);
    int insertRecoverContactCode(RecoverContactCodeEntity recoverContactCode);

    RecoverContactCodeEntity selectRecoverContactCodeByContactCodeSalt(RecoverContactCodeEntity recoverContactCode);

    int updateRecoverContactCode(RecoverContactCodeEntity recoverContactCode);
}
