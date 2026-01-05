package com.pritam.foodie.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List; // <--- 1. Import List
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

    private String imageUrl;

    private String address;

    private boolean isOpen = true;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<Review> reviews;

    // This connects the Restaurant to the FoodItem table
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL) // fetch = FetchType.EAGER might be needed if it stays empty
    private List<FoodItem> foodItems;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }

    // Helper to calculate average rating
    public double getAverageRating() {
        if (reviews == null || reviews.isEmpty()) return 0.0;
        double sum = 0;
        for (Review r : reviews) {
            sum += r.getRating();
        }
        return Math.round((sum / reviews.size()) * 10.0) / 10.0; // Round to 1 decimal
    }
}