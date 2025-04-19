package com.pritam.carrental.controller;

import com.pritam.carrental.dto.CarVariantRequestDTO;
import com.pritam.carrental.dto.CarVariantResponseDTO;
import com.pritam.carrental.payload.ApiResponse;
import com.pritam.carrental.service.CarVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/variants")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CarVariantController {

    private final CarVariantService carVariantService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CarVariantResponseDTO>> create(@Valid @RequestBody CarVariantRequestDTO variant) {
        CarVariantResponseDTO created = carVariantService.createCarVariant(variant);
        return ResponseEntity.ok(ApiResponse.success("Variant created successfully", created));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<List<CarVariantResponseDTO>>> getAll() {
        List<CarVariantResponseDTO> variants = carVariantService.getAllVariants();
        return ResponseEntity.ok(ApiResponse.success("All variants fetched", variants));
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<List<CarVariantResponseDTO>>> getByCompany(@PathVariable Long companyId) {
        List<CarVariantResponseDTO> variants = carVariantService.getVariantsByCompanyId(companyId);
        return ResponseEntity.ok(ApiResponse.success("Variants by company fetched", variants));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CarVariantResponseDTO>> update(@PathVariable Long id,
                                                                     @Valid @RequestBody CarVariantRequestDTO variant) {
        CarVariantResponseDTO updated = carVariantService.updateCarVariant(id, variant);
        return ResponseEntity.ok(ApiResponse.success("Variant updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        carVariantService.deleteCarVariant(id);
        return ResponseEntity.ok(ApiResponse.success("Variant deleted successfully", null));
    }
}
