package com.example.kakaotalk.model;

import com.example.kakaotalk.enums.MessageType;

public class ChatMessage {
    private String id;
    private MessageType type;
    private String content;
    private String sender;
    private String roomId;
    private String roomLength;
    private String sentAt;
    private boolean isRead;
    private int unreadCount;
    private int userTotalCount;
    private String check;
    private String image;

    public String getRoomId() {
        return roomId;
    }

    public ChatMessage setRoomId(String roomId) {
        this.roomId = roomId;
        return this;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getSentAt() {
        return sentAt;
    }

    public void setSentAt(String sentAt) {
        this.sentAt = sentAt;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public int getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }

    public String getCheck() {
        return check;
    }

    public ChatMessage setCheck(String check) {
        this.check = check;
        return this;
    }

    public String getId() {
        return id;
    }

    public ChatMessage setId(String id) {
        this.id = id;
        return this;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getRoomLength() {
        return roomLength;
    }

    public ChatMessage setRoomLength(String roomLength) {
        this.roomLength = roomLength;
        return this;
    }

    public int getUserTotalCount() {
        return userTotalCount;
    }

    public void setUserTotalCount(int userTotalCount) {
        this.userTotalCount = userTotalCount;
    }
}