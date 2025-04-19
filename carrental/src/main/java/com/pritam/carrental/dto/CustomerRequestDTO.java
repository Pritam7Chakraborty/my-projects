package com.pritam.carrental.dto;
import jakarta.validation.constraints.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerRequestDTO {
    @NotBlank(message = "Full name is required")
    private String fullName;
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String address;
    @NotBlank(message = "Driving license is mandatory")
    private String drivingLicenseNumber;
}
