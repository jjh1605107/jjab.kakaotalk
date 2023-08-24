package com.example.kakaotalk.mappers;

import com.example.kakaotalk.entities.ChattingRoomEntity;
import com.example.kakaotalk.entities.ChattingRoomUserListEntity;
import com.example.kakaotalk.entities.UserProfileEntity;
import com.example.kakaotalk.model.ChatMessage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChattingMapper {
    int createRoom(@Param(value = "roomId")String roomId, @Param(value = "roomName") String roomName);
    int joinRoom(@Param(value = "roomId")String roomId, @Param(value = "contact")String contact);
    ChattingRoomUserListEntity[] selectRoomList(@Param(value = "contact") String contact);
    ChattingRoomUserListEntity[] selectRoomUserList(@Param(value = "roomId")String roomId);
    ChattingRoomEntity selectRoomInfo(@Param(value = "roomId") String roomId);
    ChattingRoomUserListEntity selectMyChattingRoomList(ChatMessage chatMessage);
    ChatMessage[] fetchChatMessages(ChattingRoomUserListEntity chattingRoomUserListEntity);


    void insertChatMessage(ChatMessage chatMessage);
    void insertChatMessageCheck(@Param(value = "id")String id,
                                @Param(value = "roomId")String roomId,
                                @Param(value = "contact")String contact,
                                @Param(value = "isRead")boolean isRead);
    String[] selectRoomJoinList(@Param(value = "roomId") String roomId);
    UserProfileEntity selectUserProfileByContact(@Param(value = "contact")String contact);
    int insertAddFriendRoom(@Param(value = "contactFriend") String contactFriend, @Param(value = "roomId") String roomId);
    int updateInsertAddFriendRoom(@Param(value = "roomId")String roomId);
    int updateInsertExitFriendRoom(@Param(value = "roomId")String roomId);
    int deleteExitRoom(@Param(value = "contact") String contact, @Param(value = "roomId") String roomId);
    void deleteUserZeroRoom(@Param(value = "roomId") String roomId);
    void updateTypeConnect(@Param(value = "contact")String contact,
                          @Param(value = "roomId")String roomId);
    void updateTypeDisconnect(@Param(value = "contact")String contact,
                           @Param(value = "roomId")String roomId);
    void updateChattingRoomLastMessage(@Param(value = "content")String content,
                                       @Param(value = "sentAt")String sentAt,
                                       @Param(value = "roomId")String roomId);

    void updateChatMessageCheck(@Param(value = "id") String id,
                                @Param(value = "roomId")String roomId,
                                @Param(value = "contact")String contact);

    void updateChatMessage(@Param(value = "id") String id);
    void fetchChatMessageCheck(ChatMessage chatMessage);
    int updateRoomInfo(@Param(value = "roomName")String roomName,
                       @Param(value = "roomId")String roomId,
                       @Param(value = "contact")String contact);
}
