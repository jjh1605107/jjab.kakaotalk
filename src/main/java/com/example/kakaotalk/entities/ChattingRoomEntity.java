package com.example.kakaotalk.entities;

import java.util.Objects;

public class ChattingRoomEntity {
    private String roomId;
    private String chattingRoomName;
    private byte[] chattingRoomMainImage;
    private String chattingRoomUsers;
    private String chattingRoomLastMessage;
    private String chattingRoomLastMessageTime;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChattingRoomEntity that = (ChattingRoomEntity) o;
        return Objects.equals(roomId, that.roomId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roomId);
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getChattingRoomName() {
        return chattingRoomName;
    }

    public void setChattingRoomName(String chattingRoomName) {
        this.chattingRoomName = chattingRoomName;
    }

    public byte[] getChattingRoomMainImage() {
        return chattingRoomMainImage;
    }

    public void setChattingRoomMainImage(String chattingRoomMainImage) {
        this.chattingRoomMainImage = chattingRoomMainImage.getBytes();
    }

    public String getChattingRoomUsers() {
        return chattingRoomUsers;
    }

    public void setChattingRoomUsers(String chattingRoomUsers) {
        this.chattingRoomUsers = chattingRoomUsers;
    }

    public String getChattingRoomLastMessage() {
        return chattingRoomLastMessage;
    }

    public void setChattingRoomLastMessage(String chattingRoomLastMessage) {
        this.chattingRoomLastMessage = chattingRoomLastMessage;
    }

    public String getChattingRoomLastMessageTime() {
        return chattingRoomLastMessageTime;
    }

    public ChattingRoomEntity setChattingRoomLastMessageTime(String chattingRoomLastMessageTime) {
        this.chattingRoomLastMessageTime = chattingRoomLastMessageTime;
        return this;
    }
}
