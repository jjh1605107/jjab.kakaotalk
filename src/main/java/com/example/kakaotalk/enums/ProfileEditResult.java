package com.example.kakaotalk.enums;

public enum ProfileEditResult {
    SUCCESS("Success"),
    FAILURE("Failure"),
    UNSUPPORTED_FILE_TYPE("Unsupported File Type");
    private final String message;
    ProfileEditResult(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
}
