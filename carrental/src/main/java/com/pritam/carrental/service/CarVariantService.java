package com.pritam.carrental.service;

import com.pritam.carrental.entity.CarVariant;

import java.util.List;

public interface CarVariantService {
    CarVariant createCarVariant(CarVariant carVariant);
    List<CarVariant> getAllVariants();
    List<CarVariant> getVariantsByCompanyId(Long companyId);
    CarVariant updateCarVariant(Long id, CarVariant carVariant);
    void deleteCarVariant(Long id);
}
