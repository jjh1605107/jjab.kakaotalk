package com.example.kakaotalk.entities;

import java.util.Objects;

public class UserFriendListEntity {
    private String contact;
    private String contactFriend;
    private String userFriendNameEdit;
    private String Status;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserFriendListEntity that = (UserFriendListEntity) o;
        return Objects.equals(contact, that.contact);
    }

    @Override
    public int hashCode() {
        return Objects.hash(contact);
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getContactFriend() {
        return contactFriend;
    }

    public void setContactFriend(String contactFriend) {
        this.contactFriend = contactFriend;
    }

    public String getUserFriendNameEdit() {
        return userFriendNameEdit;
    }

    public void setUserFriendNameEdit(String userFriendNameEdit) {
        this.userFriendNameEdit = userFriendNameEdit;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String status) {
        Status = status;
    }
}
