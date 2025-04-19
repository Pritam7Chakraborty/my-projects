
package com.pritam.carrental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarVariantRequestDTO {

    @NotBlank(message = "Variant name is required")
    private String name;

    @NotBlank(message = "Fuel type is required")
    private String fuelType;

    @NotBlank(message = "Transmission type is required")
    private String transmissionType;

    @NotNull(message = "Car company ID is required")
    private Long carCompanyId;
}
