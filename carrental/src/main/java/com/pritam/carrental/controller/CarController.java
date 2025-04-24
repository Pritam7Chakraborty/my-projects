
package com.pritam.carrental.controller;

import com.pritam.carrental.dto.CarRequestDTO;
import com.pritam.carrental.dto.CarResponseDTO;
import com.pritam.carrental.payload.ApiResponse;
import com.pritam.carrental.service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<CarResponseDTO> addCar(@Valid @RequestBody CarRequestDTO request) {
        return ResponseEntity.ok(carService.addCar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarResponseDTO> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @GetMapping
    public ResponseEntity<List<CarResponseDTO>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    @GetMapping("/variant/{variantId}")
    public ResponseEntity<List<CarResponseDTO>> getCarsByVariant(@PathVariable Long variantId) {
        return ResponseEntity.ok(carService.getCarsByVariantId(variantId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CarResponseDTO> updateCar(@PathVariable Long id, @Valid @RequestBody CarRequestDTO request) {
        return ResponseEntity.ok(carService.updateCar(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok("Car deleted successfully");
    }
    @GetMapping("/available/variant/{variantId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<CarResponseDTO>>> getAvailableCarsByVariant(@PathVariable Long variantId) {
        List<CarResponseDTO> cars = carService.getAvailableCarsByVariantId(variantId);
        return ResponseEntity.ok(ApiResponse.success("Available cars for variant fetched", cars));
    }

}
