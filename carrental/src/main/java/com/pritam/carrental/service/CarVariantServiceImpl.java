package com.pritam.carrental.service;

import com.pritam.carrental.dto.CarVariantRequestDTO;
import com.pritam.carrental.dto.CarVariantResponseDTO;
import com.pritam.carrental.entity.CarCompany;
import com.pritam.carrental.entity.CarVariant;
import com.pritam.carrental.repository.CarCompanyRepository;
import com.pritam.carrental.repository.CarVariantRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarVariantServiceImpl implements CarVariantService {

    private final CarVariantRepository carVariantRepository;
    private final CarCompanyRepository carCompanyRepository;

    @Override
    public CarVariantResponseDTO createCarVariant(CarVariantRequestDTO dto) {
        CarCompany company = carCompanyRepository.findById(dto.getCarCompanyId())
                .orElseThrow(() -> new EntityNotFoundException("Car company not found"));

        CarVariant variant = CarVariant.builder()
                .name(dto.getName())
                .fuelType(dto.getFuelType())
                .transmissionType(dto.getTransmissionType())
                .carCompany(company)
                .build();

        return toDTO(carVariantRepository.save(variant));
    }

    @Override
    public List<CarVariantResponseDTO> getAllVariants() {
        return carVariantRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<CarVariantResponseDTO> getVariantsByCompanyId(Long companyId) {
        return carVariantRepository.findByCarCompanyId(companyId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public CarVariantResponseDTO updateCarVariant(Long id, CarVariantRequestDTO dto) {
        CarVariant existing = carVariantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Variant not found"));

        CarCompany company = carCompanyRepository.findById(dto.getCarCompanyId())
                .orElseThrow(() -> new EntityNotFoundException("Car company not found"));

        existing.setName(dto.getName());
        existing.setFuelType(dto.getFuelType());
        existing.setTransmissionType(dto.getTransmissionType());
        existing.setCarCompany(company);

        return toDTO(carVariantRepository.save(existing));
    }

    @Override
    public void deleteCarVariant(Long id) {
        if (!carVariantRepository.existsById(id)) {
            throw new EntityNotFoundException("Variant not found with ID: " + id);
        }
        carVariantRepository.deleteById(id);
    }

    private CarVariantResponseDTO toDTO(CarVariant variant) {
        return CarVariantResponseDTO.builder()
                .id(variant.getId())
                .name(variant.getName())
                .fuelType(variant.getFuelType())
                .transmissionType(variant.getTransmissionType())
                .carCompanyId(variant.getCarCompany().getId())
                .carCompanyName(variant.getCarCompany().getName())
                .build();
    }
}
