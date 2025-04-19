package com.pritam.carrental.repository;

import com.pritam.carrental.entity.CarVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarVariantRepository extends JpaRepository<CarVariant, Long> {
    List<CarVariant> findByCarCompanyId(Long companyId);
}
