package com.learningComponents.chat.chat;

import lombok.Data;

@Data
public class ReadReceiptRequest {
    private String reader;
    private String sender;
}
