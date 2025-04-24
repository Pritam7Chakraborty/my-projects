package com.pritam.carrental.dto;

import com.pritam.carrental.entity.Car;
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

    public static CarResponseDTO fromEntity(Car car) {
        return CarResponseDTO.builder()
                .id(car.getId())
                .name(car.getName())
                .carNumber(car.getNumberPlate())
                .available(car.isAvailable())
                .fuelType(car.getFuelType())
                .color(car.getColor())
                .seatingCapacity(car.getSeatingCapacity())
                .dailyRentPrice(car.getDailyRentPrice())
                .status(car.getStatus())
                .carVariantId(car.getCarVariant() != null ? car.getCarVariant().getId() : null)
                .carVariantName(car.getCarVariant() != null ? car.getCarVariant().getName() : null)
                .build();
    }
}
