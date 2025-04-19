package com.pritam.carrental.service;

import com.pritam.carrental.dto.CarCompanyDTO;
import com.pritam.carrental.entity.CarCompany;
import com.pritam.carrental.repository.CarCompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarCompanyService {

    private final CarCompanyRepository carCompanyRepository;

    public CarCompanyDTO createCompany(CarCompanyDTO dto) {
        CarCompany company = CarCompany.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        CarCompany saved = carCompanyRepository.save(company);
        log.info("Created car company: {}", saved.getName());

        return CarCompanyDTO.fromEntity(saved);
    }

    public List<CarCompanyDTO> getAllCompanies() {
        List<CarCompany> companies = carCompanyRepository.findAll();
        log.info("Fetched all car companies: {}", companies.size());
        return companies.stream()
                .map(CarCompanyDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CarCompanyDTO updateCompany(Long id, CarCompanyDTO dto) {
        CarCompany company = carCompanyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setName(dto.getName());
        company.setDescription(dto.getDescription());
        CarCompany updated = carCompanyRepository.save(company);

        log.info("Updated car company: {}", updated.getName());

        return CarCompanyDTO.fromEntity(updated);
    }

    public void deleteCompany(Long id) {
        carCompanyRepository.deleteById(id);
        log.info("Deleted car company with ID {}", id);
    }
}
