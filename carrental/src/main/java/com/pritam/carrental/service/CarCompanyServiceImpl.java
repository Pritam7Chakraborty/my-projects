package com.pritam.carrental.service;

import com.pritam.carrental.dto.*;
import com.pritam.carrental.entity.CarCompany;
import com.pritam.carrental.repository.CarCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarCompanyServiceImpl implements CarCompanyService {

    private final CarCompanyRepository repository;

    private CarCompanyResponseDTO mapToDTO(CarCompany company) {
        return CarCompanyResponseDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .build();
    }

    @Override
    public CarCompanyResponseDTO createCompany(CarCompanyRequestDTO dto) {
        if (repository.existsByName(dto.getName()))
            throw new IllegalArgumentException("Car company already exists!");
        CarCompany company = CarCompany.builder().name(dto.getName()).build();
        return mapToDTO(repository.save(company));
    }

    @Override
    public void deleteCompany(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<CarCompanyResponseDTO> getAllCompanies() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
