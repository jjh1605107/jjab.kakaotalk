package com.example.kakaotalk.entities;

import java.util.Objects;

public class UserProfileEntity {
    private String contact;
    private String profileMainImg;
    private String profileBackgroundImg;
    private String profileText;
    private String profileNickname;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserProfileEntity that = (UserProfileEntity) o;
        return Objects.equals(contact, that.contact);
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getProfileMainImg() {
        return profileMainImg;
    }

    public void setProfileMainImg(String profileMainImg) {
        this.profileMainImg = profileMainImg;
    }

    public String getProfileBackgroundImg() {
        return profileBackgroundImg;
    }

    public void setProfileBackgroundImg(String profileBackgroundImg) {
        this.profileBackgroundImg = profileBackgroundImg;
    }

    public String getProfileText() {
        return profileText;
    }

    public void setProfileText(String profileText) {
        this.profileText = profileText;
    }

    public String getProfileNickname() {
        return profileNickname;
    }

    public void setProfileNickname(String profileNickname) {
        this.profileNickname = profileNickname;
    }
}
