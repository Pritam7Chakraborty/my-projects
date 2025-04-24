package com.pritam.carrental.service;

import com.pritam.carrental.dto.CarRequestDTO;
import com.pritam.carrental.dto.CarResponseDTO;

import java.util.List;

public interface CarService {

    CarResponseDTO addCar(CarRequestDTO dto);

    CarResponseDTO getCarById(Long id);

    List<CarResponseDTO> getAllCars();

    List<CarResponseDTO> getAvailableCars();

    CarResponseDTO updateCar(Long id, CarRequestDTO dto);

    void deleteCar(Long id);

    List<CarResponseDTO> getCarsByVariantId(Long variantId);

    List<CarResponseDTO> getAvailableCarsByVariantId(Long variantId);

}
