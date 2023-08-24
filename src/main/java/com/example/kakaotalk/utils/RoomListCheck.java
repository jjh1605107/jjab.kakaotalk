package com.example.kakaotalk.utils;

import com.example.kakaotalk.entities.ChattingRoomUserListEntity;
import com.example.kakaotalk.services.ChattingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class RoomListCheck implements HandshakeInterceptor {
    private ChattingService chattingService;

    @Autowired
    public RoomListCheck(ChattingService chattingService) {
        this.chattingService = chattingService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {

        String cookieHeaderValue = request.getHeaders().getFirst("Cookie");
        String jwtToken = null;

        if (cookieHeaderValue != null) {
            String[] cookies = cookieHeaderValue.split("; ");
            for (String cookie : cookies) {
                String[] cookieParts = cookie.split("=");
                if (cookieParts.length == 2) {
                    String cookieName = cookieParts[0];
                    String cookieValue = cookieParts[1];
                    if ("jwtToken".equals(cookieName)) {
                        jwtToken = cookieValue;
                        break;
                    }
                }
            }
        }else{
            System.out.println("쿠키오류");
            return false;
        }
        String uri = request.getURI().toString();
        String roomId = extractRoomIdFromUri(uri);
        if (!isValidRoomId(roomId, jwtToken)) {
            return false;
        }
        attributes.put("roomId", roomId);
        return true;
    }

    //roomId파싱
    private String extractRoomIdFromUri(String uri) {
        String[] segments = uri.split("/");
        for (int i = 0; i < segments.length; i++) {
            if (segments[i].equals("chat") && i + 1 < segments.length) {
                return segments[i + 1];
            }
        }
        return null;
    }

    //유효성 확인 코드
    private boolean isValidRoomId(String roomId, String jwtToken) {
        ChattingRoomUserListEntity[] result = this.chattingService.getRoomList(jwtToken);
        for(int i = 0; i < result.length; i++){
            if(result[i].getRoomId().equals(roomId)){
                return true;
            }
        }
        return false;
    }
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}
