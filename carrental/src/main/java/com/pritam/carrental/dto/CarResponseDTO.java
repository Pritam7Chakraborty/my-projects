
package com.pritam.carrental.dto;

import com.pritam.carrental.entity.CarStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarResponseDTO {

    private Long id;
    private String name;
    private String carNumber;
    private boolean available;
    private String fuelType;
    private String color;
    private int seatingCapacity;
    private double dailyRentPrice;
    private CarStatus status;
    private Long carVariantId;
    private String carVariantName;
}
