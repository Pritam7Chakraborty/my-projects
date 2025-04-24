package com.pritam.carrental.dto;

import com.pritam.carrental.entity.CarCompany;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarCompanyResponseDTO {
    private Long id;
    private String name;
    private String description;

    public static CarCompanyResponseDTO fromEntity(CarCompany company) {
        return CarCompanyResponseDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .build();
    }
}
