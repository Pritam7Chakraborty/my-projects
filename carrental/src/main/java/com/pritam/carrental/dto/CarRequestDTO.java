
package com.pritam.carrental.dto;

import com.pritam.carrental.entity.CarStatus;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarRequestDTO {

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

    @NotNull(message = "Car status is required")
    private CarStatus status;

    @NotNull(message = "Car variant ID is required")
    private Long carVariantId;
}
