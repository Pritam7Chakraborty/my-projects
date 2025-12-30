package com.pritam.foodie.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long restaurantId;
    private String address;
    private List<CartItem> items;

    // Inner class to represent one line in the cart (e.g., "2 Pizzas")
    @Data
    public static class CartItem{
        private Long foodId;
        private int quantity;
    }
}
