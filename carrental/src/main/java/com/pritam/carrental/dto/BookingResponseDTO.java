package com.pritam.carrental.dto;

import com.pritam.carrental.entity.BookingStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {

    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long customerId;
    private String customerName;
    private Long carId;
    private String carModel;
    private Double totalAmount;
    private BookingStatus status;
}
