package com.example.kakaotalk.entities;

import java.util.Date;
import java.util.Objects;

public class UserEntity {
    private String email;
    private String password;
    private String name;
    private String contact;
    private String status;
    private boolean isSearch;
    private boolean isAdmin;
    private Date registeredAt;
    private String birthdate;
    private boolean isLunar;

    public boolean isSearch() {
        return isSearch;
    }

    public void setSearch(boolean search) {
        isSearch = search;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public UserEntity setBirthdate(String birthdate) {
        this.birthdate = birthdate;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserEntity that = (UserEntity) o;
        return Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email);
    }

    public String getEmail() {
        return email;
    }

    public UserEntity setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public UserEntity setPassword(String password) {
        this.password = password;
        return this;
    }

    public String getName() {
        return name;
    }

    public UserEntity setName(String name) {
        this.name = name;
        return this;
    }

    public String getContact() {
        return contact;
    }

    public UserEntity setContact(String contact) {
        this.contact = contact;
        return this;
    }

    public String getStatus() {
        return status;
    }

    public UserEntity setStatus(String status) {
        this.status = status;
        return this;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public UserEntity setAdmin(boolean admin) {
        isAdmin = admin;
        return this;
    }

    public Date getRegisteredAt() {
        return registeredAt;
    }

    public UserEntity setRegisteredAt(Date registeredAt) {
        this.registeredAt = registeredAt;
        return this;
    }



    public boolean isLunar() {
        return isLunar;
    }

    public UserEntity setLunar(boolean lunar) {
        isLunar = lunar;
        return this;
    }
}
