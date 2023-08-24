package com.example.kakaotalk.configs;

import com.example.kakaotalk.utils.RoomListCheck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final RoomListCheck roomListCheck;
    @Autowired
    public WebSocketConfig(RoomListCheck roomListCheck) {
        this.roomListCheck = roomListCheck;
    }
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue", "/topic");
        config.setApplicationDestinationPrefixes("/app");
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat/{roomId}")
                .setAllowedOriginPatterns("http://localhost:3000", "https://jjab.jjh1605107.co.kr")
                .addInterceptors(roomListCheck)
                .withSockJS();
    }
}
