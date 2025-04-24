package com.pritam.carrental.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "car_companies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarCompany {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;
}
