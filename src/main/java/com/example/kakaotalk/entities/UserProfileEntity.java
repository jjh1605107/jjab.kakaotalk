package com.example.kakaotalk.entities;

import java.util.Objects;

public class UserProfileEntity {
    private String contact;
    private byte[] profileMainImg;
    private int profileMainImgSize;
    private String profileMainImgContentType;

    private byte[] profileBackgroundImg;
    private int profileBackgroundImgSize;
    private String profileBackgroundImgContentType;
    private String profileText;
    private String profileNickname;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserProfileEntity that = (UserProfileEntity) o;
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

    public byte[] getProfileMainImg() {
        return profileMainImg;
    }

    public void setProfileMainImg(byte[] profileMainImg) {
        this.profileMainImg = profileMainImg;
    }

    public int getProfileMainImgSize() {
        return profileMainImgSize;
    }

    public void setProfileMainImgSize(int profileMainImgSize) {
        this.profileMainImgSize = profileMainImgSize;
    }

    public String getProfileMainImgContentType() {
        return profileMainImgContentType;
    }

    public void setProfileMainImgContentType(String profileMainImgContentType) {
        this.profileMainImgContentType = profileMainImgContentType;
    }

    public byte[] getProfileBackgroundImg() {
        return profileBackgroundImg;
    }

    public void setProfileBackgroundImg(byte[] profileBackgroundImg) {
        this.profileBackgroundImg = profileBackgroundImg;
    }

    public int getProfileBackgroundImgSize() {
        return profileBackgroundImgSize;
    }

    public void setProfileBackgroundImgSize(int profileBackgroundImgSize) {
        this.profileBackgroundImgSize = profileBackgroundImgSize;
    }

    public String getProfileBackgroundImgContentType() {
        return profileBackgroundImgContentType;
    }

    public void setProfileBackgroundImgContentType(String profileBackgroundImgContentType) {
        this.profileBackgroundImgContentType = profileBackgroundImgContentType;
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
