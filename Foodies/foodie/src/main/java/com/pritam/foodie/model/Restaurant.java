package com.pritam.foodie.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="restaurants")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String imageUrl; // We will store the image link here

    private String address;

    private boolean isOpen = true; // Default: Shop is open

    private LocalDateTime createdAt;

    // Automatically set the date when  create it
    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }
}
