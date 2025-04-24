package com.pritam.carrental.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarCompanyRequestDTO {
    private String name;
    private String description;
}
