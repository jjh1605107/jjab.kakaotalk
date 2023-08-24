package com.example.kakaotalk.entities;

import java.util.Objects;

public class ChattingMessagesCheckEntity {
    private String roomId;
    private String contact;
    private String chattingMessagesContentId;
    private boolean isRead;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChattingMessagesCheckEntity that = (ChattingMessagesCheckEntity) o;
        return Objects.equals(roomId, that.roomId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roomId);
    }

    public String getRoomId() {
        return roomId;
    }

    public ChattingMessagesCheckEntity setRoomId(String roomId) {
        this.roomId = roomId;
        return this;
    }

    public String getContact() {
        return contact;
    }

    public ChattingMessagesCheckEntity setContact(String contact) {
        this.contact = contact;
        return this;
    }

    public String getChattingMessagesContentId() {
        return chattingMessagesContentId;
    }

    public ChattingMessagesCheckEntity setChattingMessagesContentId(String chattingMessagesContentId) {
        this.chattingMessagesContentId = chattingMessagesContentId;
        return this;
    }

    public boolean isRead() {
        return isRead;
    }

    public ChattingMessagesCheckEntity setRead(boolean read) {
        isRead = read;
        return this;
    }
}
