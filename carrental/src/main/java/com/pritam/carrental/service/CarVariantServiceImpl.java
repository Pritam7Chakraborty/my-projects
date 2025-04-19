package com.pritam.carrental.service;

import com.pritam.carrental.entity.CarCompany;
import com.pritam.carrental.entity.CarVariant;
import com.pritam.carrental.repository.CarCompanyRepository;
import com.pritam.carrental.repository.CarVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarVariantServiceImpl implements CarVariantService {
    @Autowired
    private CarVariantRepository carVariantRepository;
    @Autowired
    private CarCompanyRepository carCompanyRepository;
    @Override
    public CarVariant createCarVariant (CarVariant carVariant){
        Long companyId = carVariant.getCarCompany().getId();
        CarCompany company= carCompanyRepository.findById(companyId).orElseThrow(()-> new RuntimeException("Car company not found with ID: " + companyId));
        carVariant.setCarCompany(company);
        return carVariantRepository.save(carVariant);
    }
    @Override
    public List<CarVariant> getAllVariants() {
        return carVariantRepository.findAll();
    }

    @Override
    public List<CarVariant> getVariantsByCompanyId(Long companyId) {
        return carVariantRepository.findByCarCompanyId(companyId);
    }

    @Override
    public CarVariant updateCarVariant(Long id, CarVariant updatedVariant) {
        CarVariant existing = carVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found with ID: " + id));

        existing.setName(updatedVariant.getName());
        existing.setFuelType(updatedVariant.getFuelType());
        existing.setTransmissionType(updatedVariant.getTransmissionType());

        Long companyId = updatedVariant.getCarCompany().getId();
        CarCompany company = carCompanyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Car company not found with ID: " + companyId));
        existing.setCarCompany(company);

        return carVariantRepository.save(existing);
    }

    @Override
    public void deleteCarVariant(Long id) {
        if (!carVariantRepository.existsById(id)) {
            throw new RuntimeException("Variant not found with ID: " + id);
        }
        carVariantRepository.deleteById(id);
    }
}
