package com.pritam.foodie.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who placed the order?
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Which restaurant is this from?
    @ManyToOne
    @JoinColumn(name="restaurant_id")
    private Restaurant restaurant;

    private Double totalAmount;

    private String status;

    private String deliveryAddress;

    // PENDING, PREPARING, DELIVERED
    private LocalDateTime createdAt;

    // One Order has MANY Items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        // Default status
        status = "PENDING";
    }
}
