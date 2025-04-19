
package com.pritam.carrental.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarVariantResponseDTO {

    private Long id;
    private String name;
    private String fuelType;
    private String transmissionType;
    private Long carCompanyId;
    private String carCompanyName;
}
