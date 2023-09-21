package com.example.kakaotalk.services;

import com.example.kakaotalk.entities.ChattingRoomEntity;
import com.example.kakaotalk.entities.ChattingRoomUserListEntity;
import com.example.kakaotalk.entities.UserProfileEntity;
import com.example.kakaotalk.enums.MessageType;
import com.example.kakaotalk.enums.StatusResult;
import com.example.kakaotalk.mappers.ChattingMapper;
import com.example.kakaotalk.mappers.UserMapper;
import com.example.kakaotalk.model.ChatMessage;
import com.example.kakaotalk.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ChattingService {
    private final ChattingMapper chattingMapper;
    private final UserMapper userMapper;

    @Autowired
    public ChattingService(ChattingMapper chattingMapper, UserMapper userMapper) {
        this.chattingMapper = chattingMapper;
        this.userMapper = userMapper;
    }

    public StatusResult createRoom(String jwtValue, String contactFriend) {
        String contact = JwtUtil.jwtUser(jwtValue);
        String roomId = UUID.randomUUID().toString();
        String sharedId = roomId;
        if(!this.userMapper.selectFriendContactStatus(contact, contactFriend).getStatus().equals("BLOCK")){
            String roomName = this.userMapper.selectUserProfileByContact(contact).getProfileNickname()+", "+this.userMapper.selectUserProfileByContact(contactFriend).getProfileNickname();
            this.chattingMapper.createRoom(sharedId, roomName);
            this.chattingMapper.joinRoom(sharedId, contact);
            this.chattingMapper.joinRoom(sharedId, contactFriend);
            return StatusResult.SUCCESS;
        }else{
            return StatusResult.FAILURE;
        }
    }

    public ChattingRoomUserListEntity[] getRoomList(String jwtValue) {
        String contact = JwtUtil.jwtUser(jwtValue);
        return this.chattingMapper.selectRoomList(contact);
    }

    public ChattingRoomEntity getRoomInfo(String roomId){
        return this.chattingMapper.selectRoomInfo(roomId);
    }
    public void saveMessage(ChatMessage chatMessage) {
        chatMessage.setSentAt(String.valueOf(LocalDateTime.now()));
        ChattingRoomUserListEntity[] readCheck = this.chattingMapper.selectRoomUserList(chatMessage.getRoomId());
        this.chattingMapper.insertChatMessage(chatMessage);
        //채팅 저장후 리턴된 index를 check 테이블에 다시 저장
        for (int i = 0; i < readCheck.length; i++){
            if(chatMessage.getCheck().equals(readCheck[i].getContact())){
                this.chattingMapper.insertChatMessageCheck(chatMessage.getId(), chatMessage.getRoomId(), readCheck[i].getContact(), true);
            }else{
                this.chattingMapper.insertChatMessageCheck(chatMessage.getId(), chatMessage.getRoomId(), readCheck[i].getContact(), false);
            }
            //채팅중인 유저 수 만큼 읽음 처리
            if(readCheck[i].getType().equals("CONNECT")) {
                chatMessage.setRead(true);
                chatMessage.setUnreadCount(chatMessage.getUnreadCount()-1);
                this.chattingMapper.updateChatMessageCheck(chatMessage.getId(), readCheck[i].getRoomId(), readCheck[i].getContact());
                this.chattingMapper.updateChatMessage(chatMessage.getId());
            }
        }
        chatMessage.setUserTotalCount(readCheck.length);
        //마지막 채팅 저장
        if(chatMessage.getType().equals(MessageType.CHAT)){
            this.chattingMapper.updateChattingRoomLastMessage(chatMessage.getContent(), chatMessage.getSentAt(), chatMessage.getRoomId());
        }
    }

    public ChatMessage[] fetchChatMessages(ChatMessage chatMessage) {
        this.chattingMapper.fetchChatMessageCheck(chatMessage);
        return this.chattingMapper.fetchChatMessages(this.chattingMapper.selectMyChattingRoomList(chatMessage));
    }

    public UserProfileEntity[] getRoomJoinList(String roomId) {
        String[] contacts = this.chattingMapper.selectRoomJoinList(roomId);
        UserProfileEntity[] userList = new UserProfileEntity[contacts.length];
        for(int i = 0; i < contacts.length; i++){
            userList[i] = this.chattingMapper.selectUserProfileByContact(contacts[i]);
        }
        return userList;
    }

    public StatusResult addFriendRoom(String contactFriend, String roomId) {
        String[] contacts = this.chattingMapper.selectRoomJoinList(roomId);
        for(int i = 0; i < contacts.length; i++) {
            if (contacts[i].equals(contactFriend)){
                return StatusResult.DUPLICATE;
            }
        }
        if(this.chattingMapper.insertAddFriendRoom(contactFriend, roomId) > 0){
            if(this.chattingMapper.updateInsertAddFriendRoom(roomId) > 0){
                return StatusResult.SUCCESS;
            }
        }
        return StatusResult.FAILURE;
    }
    public StatusResult exitFriendRoom(String contact, String roomId){
        String[] contacts = this.chattingMapper.selectRoomJoinList(roomId);
        for(int i = 0; i < contacts.length; i++) {
            if (contacts[i].equals(contact)){
                this.chattingMapper.updateInsertExitFriendRoom(roomId);
                this.chattingMapper.deleteExitRoom(contact, roomId);
                if(this.chattingMapper.selectRoomInfo(roomId).getChattingRoomUsers().equals("0")){
                    this.chattingMapper.deleteUserZeroRoom(roomId);
                }
                return StatusResult.SUCCESS;
            }
        }
        return StatusResult.FAILURE;
    }

    public void updateTypeConnect(String contact, String roomId) {
        this.chattingMapper.updateTypeConnect(contact, roomId);
    }

    public void updateTypeDisconnect(String contact, String roomId) {
        this.chattingMapper.updateTypeDisconnect(contact, roomId);
    }
    @Transactional
    public StatusResult updateRoomInfo(String roomName, String roomId, String contact){
        return this.chattingMapper.updateRoomInfo(roomName, roomId, contact) > 0 ? StatusResult.SUCCESS : StatusResult.FAILURE;
    }
}
