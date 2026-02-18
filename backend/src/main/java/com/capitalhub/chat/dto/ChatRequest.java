package com.capitalhub.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class ChatRequest {

    @NotBlank
    private String context; // "training" or "marketplace"

    @NotEmpty
    private List<Message> messages;

    @Data
    public static class Message {
        @NotBlank
        private String role; // "user" or "assistant"
        @NotBlank
        private String content;
    }
}
