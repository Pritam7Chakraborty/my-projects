package com.pritam.carrental.service;

import com.pritam.carrental.dto.CarVariantRequestDTO;
import com.pritam.carrental.dto.CarVariantResponseDTO;

import java.util.List;

public interface CarVariantService {

    CarVariantResponseDTO createCarVariant(CarVariantRequestDTO dto);

    List<CarVariantResponseDTO> getAllVariants();

    List<CarVariantResponseDTO> getVariantsByCompanyId(Long companyId);

    CarVariantResponseDTO updateCarVariant(Long id, CarVariantRequestDTO dto);

    void deleteCarVariant(Long id);
}
