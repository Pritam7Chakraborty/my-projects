package com.pritam.carrental.service;

import com.pritam.carrental.dto.CarCompanyRequestDTO;
import com.pritam.carrental.dto.CarCompanyResponseDTO;

import java.util.List;

public interface CarCompanyService {

    CarCompanyResponseDTO createCompany(CarCompanyRequestDTO dto);

    void deleteCompany(Long id);

    List<CarCompanyResponseDTO> getAllCompanies();
}
