package com.pritam.carrental.controller;

import com.pritam.carrental.dto.*;
import com.pritam.carrental.service.CarCompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CarCompanyController {

    private final CarCompanyService service;

    @PostMapping
    public ResponseEntity<CarCompanyResponseDTO> create(@RequestBody CarCompanyRequestDTO dto) {
        return ResponseEntity.ok(service.createCompany(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CarCompanyResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAllCompanies());
    }
}
