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
@RequestMapping("/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CarResponseDTO>> addCar(@Valid @RequestBody CarRequestDTO car) {
        CarResponseDTO savedCar = carService.addCar(car);
        return ResponseEntity.ok(ApiResponse.success("Car added successfully", savedCar));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<List<CarResponseDTO>>> getAllCars() {
        List<CarResponseDTO> cars = carService.getAllCars();
        return ResponseEntity.ok(ApiResponse.success("Cars retrieved successfully", cars));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<CarResponseDTO>> getCarById(@PathVariable Long id) {
        CarResponseDTO car = carService.getCarById(id);
        return ResponseEntity.ok(ApiResponse.success("Car fetched successfully", car));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(ApiResponse.success("Car deleted successfully", null));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CarResponseDTO>> updateCar(@PathVariable Long id, @Valid @RequestBody CarRequestDTO updatedCar) {
        CarResponseDTO result = carService.updateCar(id, updatedCar);
        return ResponseEntity.ok(ApiResponse.success("Car updated successfully", result));
    }
}
