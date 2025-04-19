// Response DTO
package com.pritam.carrental.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarCompanyResponseDTO {
    private Long id;
    private String name;
}
