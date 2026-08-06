package com.learningComponents.chat.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findAllByRecipientIsNullOrderByTimestampAsc();

    @Query("SELECT m FROM ChatMessage m WHERE (m.sender = :userA AND m.recipient = :userB) OR (m.sender = :userB AND m.recipient = :userA) ORDER BY m.timestamp ASC")
    List<ChatMessage> findPrivateMessages(@Param("userA") String userA, @Param("userB") String userB);

    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage c SET c.isRead = true WHERE c.sender = :sender AND c.recipient = :reader AND c.isRead = false")
    void markMessagesAsRead(@Param("sender") String sender, @Param("reader") String reader);
}