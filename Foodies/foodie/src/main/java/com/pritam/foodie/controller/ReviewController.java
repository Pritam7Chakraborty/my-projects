package com.pritam.foodie.controller;

import com.pritam.foodie.model.Restaurant;
import com.pritam.foodie.model.Review;
import com.pritam.foodie.model.User;
import com.pritam.foodie.repository.RestaurantRepository;
import com.pritam.foodie.repository.ReviewRepository;
import com.pritam.foodie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private UserRepository userRepository;

    // Add a Review
    @PostMapping("/{restaurantId}")
    public Review addReview(@PathVariable Long restaurantId, @RequestBody Review review, Authentication auth) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        review.setRestaurant(restaurant);
        review.setUser(user);

        return reviewRepository.save(review);
    }

    // Get Reviews for a Restaurant
    @GetMapping("/{restaurantId}")
    public List<Review> getRestaurantReviews(@PathVariable Long restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId);
    }
}