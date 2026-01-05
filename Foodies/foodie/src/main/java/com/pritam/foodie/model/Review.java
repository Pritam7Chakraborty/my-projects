package com.pritam.foodie.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name="reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private int rating; // 1 to 5

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Who wrote it

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    @JsonIgnore // Prevent infinite recursion
    private Restaurant restaurant; // Which restaurant

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}