package com.pritam.carrental.service;

import com.pritam.carrental.dto.CarVariantRequestDTO;
import com.pritam.carrental.dto.CarVariantResponseDTO;
import com.pritam.carrental.entity.CarCompany;
import com.pritam.carrental.entity.CarVariant;
import com.pritam.carrental.repository.CarCompanyRepository;
import com.pritam.carrental.repository.CarVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarVariantService {

    private final CarVariantRepository carVariantRepository;
    private final CarCompanyRepository carCompanyRepository;

    public CarVariantResponseDTO createCarVariant(CarVariantRequestDTO dto) {
        CarCompany company = carCompanyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Car company not found"));

        CarVariant variant = CarVariant.builder()
                .model(dto.getModel())
                .seats(dto.getSeats())
                .price(dto.getPrice())
                .company(company)
                .build();

        CarVariant saved = carVariantRepository.save(variant);
        log.info("Created car variant {} for company {}", variant.getModel(), company.getName());

        return CarVariantResponseDTO.fromEntity(saved);
    }

    public List<CarVariantResponseDTO> getAllVariants() {
        List<CarVariant> variants = carVariantRepository.findAll();
        log.info("Fetched all car variants: {}", variants.size());
        return variants.stream()
                .map(CarVariantResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CarVariantResponseDTO> getVariantsByCompanyId(Long companyId) {
        List<CarVariant> variants = carVariantRepository.findByCompanyId(companyId);
        log.info("Fetched {} variants for company ID {}", variants.size(), companyId);
        return variants.stream()
                .map(CarVariantResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CarVariantResponseDTO updateCarVariant(Long id, CarVariantRequestDTO dto) {
        CarVariant variant = carVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        CarCompany company = carCompanyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Car company not found"));

        variant.setModel(dto.getModel());
        variant.setSeats(dto.getSeats());
        variant.setPrice(dto.getPrice());
        variant.setCompany(company);

        CarVariant updated = carVariantRepository.save(variant);
        log.info("Updated car variant {} with ID {}", updated.getModel(), updated.getId());

        return CarVariantResponseDTO.fromEntity(updated);
    }

    public void deleteCarVariant(Long id) {
        carVariantRepository.deleteById(id);
        log.info("Deleted car variant with ID {}", id);
    }
}
