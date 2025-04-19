package com.pritam.carrental.repository;

import com.pritam.carrental.entity.CarCompany;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarCompanyRepository extends JpaRepository<CarCompany, Long> {
    boolean existsByName(String name);
}
