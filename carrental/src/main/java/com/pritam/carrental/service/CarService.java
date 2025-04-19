package com.pritam.carrental.service;

import com.pritam.carrental.dto.CarDTO;
import com.pritam.carrental.entity.Car;
import com.pritam.carrental.entity.CarVariant;
import com.pritam.carrental.enums.CarStatus;
import com.pritam.carrental.repository.CarRepository;
import com.pritam.carrental.repository.CarVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarService {

    private final CarRepository carRepository;
    private final CarVariantRepository carVariantRepository;

    public CarDTO createCar(CarDTO dto) {
        CarVariant variant = carVariantRepository.findById(dto.getVariantId())
                .orElseThrow(() -> new RuntimeException("Car Variant not found"));

        Car car = Car.builder()
                .number(dto.getNumber())
                .status(CarStatus.AVAILABLE)
                .variant(variant)
                .build();

        Car saved = carRepository.save(car);
        log.info("Created car with number {} for variant {}", saved.getNumber(), variant.getModel());

        return CarDTO.fromEntity(saved);
    }

    public List<CarDTO> getAllCars() {
        List<Car> cars = carRepository.findAll();
        log.info("Fetched all cars: {}", cars.size());
        return cars.stream()
                .map(CarDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CarDTO> getCarsByVariantId(Long variantId) {
        List<Car> cars = carRepository.findByVariantId(variantId);
        log.info("Fetched cars for variant {}: {}", variantId, cars.size());
        return cars.stream()
                .map(CarDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CarDTO updateCar(Long id, CarDTO dto) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        CarVariant variant = carVariantRepository.findById(dto.getVariantId())
                .orElseThrow(() -> new RuntimeException("Car Variant not found"));

        car.setNumber(dto.getNumber());
        car.setVariant(variant);
        car.setStatus(dto.getStatus());

        Car updated = carRepository.save(car);
        log.info("Updated car {} with variant {}", updated.getNumber(), variant.getModel());

        return CarDTO.fromEntity(updated);
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
        log.info("Deleted car with ID {}", id);
    }
}
