package com.pritam.carrental.service;

import com.pritam.carrental.dto.CarRequestDTO;
import com.pritam.carrental.dto.CarResponseDTO;
import com.pritam.carrental.entity.Car;
import com.pritam.carrental.entity.CarStatus;
import com.pritam.carrental.entity.CarVariant;
import com.pritam.carrental.repository.CarRepository;
import com.pritam.carrental.repository.CarVariantRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;
    private final CarVariantRepository carVariantRepository;

    @Override
    public CarResponseDTO addCar(CarRequestDTO dto) {
        CarVariant variant = carVariantRepository.findById(dto.getVariantId())
                .orElseThrow(() -> new EntityNotFoundException("CarVariant not found"));

        Car car = Car.builder()
                .name(dto.getName())
                .numberPlate(dto.getNumberPlate())
                .available(dto.isAvailable())
                .fuelType(dto.getFuelType())
                .color(dto.getColor())
                .seatingCapacity(dto.getSeatingCapacity())
                .dailyRentPrice(dto.getDailyRentPrice())
                .status(dto.getStatus())
                .carVariant(variant)
                .build();

        return convertToDTO(carRepository.save(car));
    }

    @Override
    public List<CarResponseDTO> getAllCars() {
        return carRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CarResponseDTO getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Car not found with ID: " + id));
        return convertToDTO(car);
    }

    @Override
    public CarResponseDTO updateCar(Long id, CarRequestDTO dto) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));

        CarVariant variant = carVariantRepository.findById(dto.getVariantId())
                .orElseThrow(() -> new EntityNotFoundException("CarVariant not found"));

        car.setName(dto.getName());
        car.setNumberPlate(dto.getNumberPlate());
        car.setAvailable(dto.isAvailable());
        car.setFuelType(dto.getFuelType());
        car.setColor(dto.getColor());
        car.setSeatingCapacity(dto.getSeatingCapacity());
        car.setDailyRentPrice(dto.getDailyRentPrice());
        car.setStatus(dto.getStatus());
        car.setCarVariant(variant);

        return convertToDTO(carRepository.save(car));
    }

    @Override
    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }

    @Override
    public List<CarResponseDTO> getAvailableCars() {
        return carRepository.findByStatus(CarStatus.AVAILABLE)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CarResponseDTO convertToDTO(Car car) {
        return CarResponseDTO.builder()
                .id(car.getId())
                .name(car.getName())
                .carNumber(car.getNumberPlate())
                .available(car.isAvailable())
                .fuelType(car.getFuelType())
                .color(car.getColor())
                .seatingCapacity(car.getSeatingCapacity())
                .dailyRentPrice(car.getDailyRentPrice())
                .status(car.getStatus())
                .carVariantId(car.getCarVariant().getId())
                .carVariantName(car.getCarVariant().getName())
                .build();
    }
    @Override
    public List<CarResponseDTO> getCarsByVariantId(Long variantId) {
        List<Car> cars = carRepository.findByCarVariantId(variantId);
        return cars.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CarResponseDTO> getAvailableCarsByVariantId(Long variantId) {
        return carRepository.findByCarVariantIdAndStatus(variantId, CarStatus.AVAILABLE)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

}
