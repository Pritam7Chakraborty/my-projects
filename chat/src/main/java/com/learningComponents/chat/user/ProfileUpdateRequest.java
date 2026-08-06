package com.learningComponents.chat.user;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String username;
    private String displayName;
    private String themeColor;
    private String avatarBase64;
}
