package com.pritam.carrental.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Car name is required")
    private String name;

    @NotBlank(message = "Car number is required")
    private String carNumber;

    private boolean available;

    @NotBlank(message = "Fuel type is required")
    private String fuelType;

    @NotBlank(message = "Color is required")
    private String color;

    @Min(value = 1, message = "Seating capacity must be at least 1")
    private int seatingCapacity;

    @Positive(message = "Daily rent price must be greater than zero")
    private double dailyRentPrice;

    @Enumerated(EnumType.STRING)
    private CarStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    @NotNull(message = "Car variant must be provided")
    private CarVariant carVariant;
}
