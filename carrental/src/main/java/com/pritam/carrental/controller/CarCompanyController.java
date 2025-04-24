package com.pritam.carrental.controller;

import com.pritam.carrental.dto.CarCompanyRequestDTO;
import com.pritam.carrental.dto.CarCompanyResponseDTO;
import com.pritam.carrental.payload.ApiResponse;
import com.pritam.carrental.service.CarCompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CarCompanyController {

    private final CarCompanyService service;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<CarCompanyResponseDTO>> create(@Valid @RequestBody CarCompanyRequestDTO dto) {
        CarCompanyResponseDTO response = service.createCompany(dto);
        return ResponseEntity.ok(ApiResponse.success("Company created successfully", response));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.deleteCompany(id);
        return ResponseEntity.ok(ApiResponse.success("Company deleted successfully", null));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<CarCompanyResponseDTO>>> getAll() {
        List<CarCompanyResponseDTO> companies = service.getAllCompanies();
        return ResponseEntity.ok(ApiResponse.success("All companies retrieved", companies));
    }
}
