package com.learningComponents.chat.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.learningComponents.chat.user.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        chatMessage.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(chatMessage);
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        userRepository.findByUsername(chatMessage.getSender()).ifPresent(user -> {
            user.setStatus(com.learningComponents.chat.user.Status.ONLINE);
            userRepository.save(user);
        });

        chatMessage.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(chatMessage);
    }

    @MessageMapping("/chat.private")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        chatMessage.setTimestamp(LocalDateTime.now());
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipient(),
                "/queue/messages",
                savedMessage
        );
    }

    @GetMapping("/api/messages/public")
    public List<ChatMessage> getPublicChatHistory() {
        return chatMessageRepository.findAllByRecipientIsNullOrderByTimestampAsc();
    }

    @GetMapping("/api/messages/private/{userA}/{userB}")
    public List<ChatMessage> getPrivateChatHistory(@PathVariable String userA, @PathVariable String userB) {
        return chatMessageRepository.findPrivateMessages(userA, userB);
    }

    @MessageMapping("/chat.read")
    public void processReadReceipt(@Payload ReadReceiptRequest request) {
        // 1. Update the database (Mark messages sent by 'sender' to 'reader' as read)
        chatMessageRepository.markMessagesAsRead(request.getSender(), request.getReader());

        // 2. Notify the original sender that their messages were seen
        messagingTemplate.convertAndSendToUser(
                request.getSender(),
                "/queue/receipts",
                request
        );
    }

    @MessageMapping("/chat.typing")
    public void sendTypingIndicator(@Payload ChatMessage chatMessage) {
        if (chatMessage.getRecipient() != null) {
            // Forward typing status to the specific private recipient
            messagingTemplate.convertAndSendToUser(
                    chatMessage.getRecipient(),
                    "/queue/typing",
                    chatMessage
            );
        }
    }
}