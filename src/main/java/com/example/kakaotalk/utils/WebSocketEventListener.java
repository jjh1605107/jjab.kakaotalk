package com.example.kakaotalk.utils;

import com.example.kakaotalk.enums.MessageType;
import com.example.kakaotalk.model.ChatMessage;
import com.example.kakaotalk.services.ChattingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;

@Component
public class WebSocketEventListener {

    private SimpMessageSendingOperations messagingTemplate;
    private final ChattingService chattingService;

    @Autowired
    public WebSocketEventListener(SimpMessageSendingOperations messagingTemplate, ChattingService chattingService) {
        this.messagingTemplate = messagingTemplate;
        this.chattingService = chattingService;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {}

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String roomId = (String) headerAccessor.getSessionAttributes().get("roomId");
        String contact = (String) headerAccessor.getSessionAttributes().get("contact");
        if (username != null && roomId != null) {
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(MessageType.LEAVE);
            chatMessage.setSender(username);
            chatMessage.setContent("LEAVE");
            chatMessage.setRoomId(roomId);
            chatMessage.setUnreadCount(0);
            chatMessage.setCheck(contact);
            chatMessage.setSentAt(String.valueOf(LocalDateTime.now()));
            chatMessage.setRead(false);
            this.chattingService.saveMessage(chatMessage);
            this.chattingService.updateTypeDisconnect(chatMessage.getCheck(), chatMessage.getRoomId());
            String topic = "/topic/public/" + roomId;
            messagingTemplate.convertAndSend(topic, chatMessage);
        }
    }
}
