package com.example.kakaotalk.controllers;
import com.example.kakaotalk.entities.ChattingRoomEntity;
import com.example.kakaotalk.entities.ChattingRoomUserListEntity;
import com.example.kakaotalk.entities.UserProfileEntity;
import com.example.kakaotalk.enums.ClientJwtResult;
import com.example.kakaotalk.enums.MessageType;
import com.example.kakaotalk.enums.StatusResult;
import com.example.kakaotalk.model.ChatMessage;
import com.example.kakaotalk.services.ChattingService;
import com.example.kakaotalk.services.UserService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping(value = "/chat")
public class ChatController {
    private final ChattingService chattingService;
    private final UserService userService;

    @Autowired
    public ChatController(ChattingService chattingService, UserService userService) {
        this.chattingService = chattingService;
        this.userService = userService;
    }




    @MessageMapping("/chat.sendMessage/{roomId}")
    @SendTo("/topic/public/{roomId}")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        this.chattingService.saveMessage(chatMessage);
        return chatMessage;
    }

    @MessageMapping("/chat.addUser/{roomId}")
    @SendTo("/topic/public/{roomId}")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        headerAccessor.getSessionAttributes().put("contact", chatMessage.getCheck());
        if(chatMessage.getType().equals(MessageType.JOIN)){
            this.chattingService.updateTypeConnect(chatMessage.getCheck(), chatMessage.getRoomId());
            chatMessage.setRoomLength(this.chattingService.getRoomInfo(chatMessage.getRoomId()).getChattingRoomUsers());
        }
        this.chattingService.saveMessage(chatMessage);
        return chatMessage;
    }






    @RequestMapping(value = "/fetchChatMessages",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ChatMessage[] fetchChatMessages(ChatMessage chatMessage) throws InterruptedException {
        ChatMessage[] result = this.chattingService.fetchChatMessages(chatMessage);
        return result;
    }
    @RequestMapping(value = "/createRoom",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String createRoom(@CookieValue(name = "jwtToken") String jwtValue,
                             @RequestParam(name = "contactFriend")String contactFriend) {
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.NULL || check == ClientJwtResult.FALSE){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        StatusResult result = this.chattingService.createRoom(jwtValue, contactFriend);
        if(result == StatusResult.FAILURE){
            JSONObject responseObject = new JSONObject(){{
                put("result", result.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        JSONObject responseObject = new JSONObject(){{
            put("result", StatusResult.SUCCESS);
        }};
        System.out.println(responseObject+"뭔오류냐?");
        return responseObject.toString();
    }


    @RequestMapping(value = "/addFriendRoom",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String addFriendRoom(@CookieValue(name = "jwtToken") String jwtValue,
                                @RequestParam(name = "contactFriend")String contactFriend,
                                @RequestParam(name = "roomId")String roomId){
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.NULL || check == ClientJwtResult.FALSE){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        StatusResult result = this.chattingService.addFriendRoom(contactFriend, roomId);
        JSONObject responseObject = new JSONObject(){{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    @RequestMapping(value = "/getRoomList",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getRoomList(@CookieValue(name = "jwtToken") String jwtValue){
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.NULL || check == ClientJwtResult.FALSE){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        ChattingRoomUserListEntity[] result = this.chattingService.getRoomList(jwtValue);

        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < result.length; i++) {
            ChattingRoomEntity roomInfo = this.chattingService.getRoomInfo(result[i].getRoomId());
            JSONObject roomListObject = new JSONObject();
            roomListObject.put("roomId",  roomInfo.getRoomId());
            roomListObject.put("roomName",  roomInfo.getChattingRoomName());
            roomListObject.put("roomMainImage",  roomInfo.getChattingRoomMainImage());
            roomListObject.put("roomUsers", roomInfo.getChattingRoomUsers());
            roomListObject.put("roomLastMessage", roomInfo.getChattingRoomLastMessage());
            roomListObject.put("roomLastMessageTime", roomInfo.getChattingRoomLastMessageTime());
            System.out.println(roomInfo.getChattingRoomMainImage()+"뒘?");
            System.out.println(roomInfo.getChattingRoomUsers()+"퉴?");
            System.out.println(roomInfo.getChattingRoomName()+"쉠?");
            jsonArray.put(roomListObject);
        }
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", jsonArray);
        return responseObject.toString();
    }

    @RequestMapping(value = "/getRoomJoinList",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getRoomJoinList(@CookieValue(name = "jwtToken") String jwtValue,
                                  @RequestParam(name = "roomId") String roomId){
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.NULL || check == ClientJwtResult.FALSE){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        UserProfileEntity[] result = this.chattingService.getRoomJoinList(roomId);
        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < result.length; i++) {
            JSONObject userObject = new JSONObject();
            userObject.put("contact", result[i].getContact());
            userObject.put("profileMainImg", result[i].getProfileMainImg());
            userObject.put("profileBackgroundImg", result[i].getProfileBackgroundImg());
            userObject.put("profileText", result[i].getProfileText());
            userObject.put("profileNickname", result[i].getProfileNickname());
            jsonArray.put(userObject);
        }
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", jsonArray);
        responseObject.put("userCount", result.length);
        return responseObject.toString();
    }

    @RequestMapping(value = "/exitRoom",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String exitRoom(@CookieValue(name = "jwtToken") String jwtValue,
                           @RequestParam(name = "contact") String contact,
                           @RequestParam(name = "roomId")String roomId){
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.NULL || check == ClientJwtResult.FALSE){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        StatusResult result = this.chattingService.exitFriendRoom(contact, roomId);
        JSONObject responseObject = new JSONObject(){{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }
    //아직 사용안함
    @RequestMapping(value = "/updateRoomInfo",
                    method = RequestMethod.GET,
                    produces = MediaType.APPLICATION_JSON_VALUE)
    public String updateRoomInfo(@CookieValue(name = "jwtToken") String jwtValue,
                                 @RequestParam(name = "roomName") String roomName,
                                 @RequestParam(name = "roomId") String roomId){
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.NULL || check == ClientJwtResult.FALSE){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        StatusResult result = this.chattingService.updateRoomInfo(roomName, roomId, jwtValue);
        JSONObject responseObject = new JSONObject(){{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }
    //방정보
    @RequestMapping(value = "/getRoomInfo",
                    method = RequestMethod.GET,
                    produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRoomInf(@CookieValue(name = "jwtToken") String jwtValue,
                             @RequestParam(name = "roomId") String roomId){
        ClientJwtResult check = this.userService.jwtCheck(jwtValue);
        if(check == ClientJwtResult.NULL || check == ClientJwtResult.FALSE){
            JSONObject responseObject = new JSONObject(){{
                put("result", check.name().toLowerCase());
            }};
            return responseObject.toString();
        }
        ChattingRoomEntity result = this.chattingService.getRoomInfo(roomId);
        JSONObject responseObject = new JSONObject();
        responseObject.put("roomId",  result.getRoomId());
        responseObject.put("roomName",  result.getChattingRoomName());
        responseObject.put("roomMainImage",  result.getChattingRoomMainImage());
        responseObject.put("roomUsers", result.getChattingRoomUsers());
        return responseObject.toString();
    }
}
