package com.example.kakaotalk.entities;

import java.util.Objects;

public class ChattingRoomUserListEntity {
    private String roomId;
    private String contact;
    private String roomJoinTimeAs;
    private String type;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChattingRoomUserListEntity that = (ChattingRoomUserListEntity) o;
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

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getRoomJoinTimeAs() {
        return roomJoinTimeAs;
    }

    public void setRoomJoinTimeAs(String roomJoinTimeAs) {
        this.roomJoinTimeAs = roomJoinTimeAs;
    }

    public String getType() {
        return type;
    }

    public ChattingRoomUserListEntity setType(String type) {
        this.type = type;
        return this;
    }
}
