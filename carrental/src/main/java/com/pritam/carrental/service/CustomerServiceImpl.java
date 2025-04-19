package com.pritam.carrental.service;

import com.pritam.carrental.dto.CustomerRequestDTO;
import com.pritam.carrental.dto.CustomerResponseDTO;
import com.pritam.carrental.entity.Customer;
import com.pritam.carrental.exception.CustomerNotFoundException;
import com.pritam.carrental.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository repository;

    private CustomerResponseDTO mapToDTO(Customer customer){
    return CustomerResponseDTO.builder()
            .id(customer.getId())
            .fullName(customer.getFullName())
            .email(customer.getEmail())
            .phoneNumber(customer.getPhoneNumber())
            .address(customer.getAddress())
            .drivingLicenseNumber(customer.getDrivingLicenseNumber())
            .build();
    }

    @Override
    public CustomerResponseDTO createCustomer(CustomerRequestDTO dto)
    {
        Customer customer = Customer.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .drivingLicenseNumber(dto.getDrivingLicenseNumber())
                .build();
        return mapToDTO(repository.save(customer));
    }
    @Override
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO dto) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
        customer.setFullName(dto.getFullName());
        customer.setEmail(dto.getEmail());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setAddress(dto.getAddress());
        customer.setDrivingLicenseNumber(dto.getDrivingLicenseNumber());
        return mapToDTO(repository.save(customer));
    }

    @Override
    public void deleteCustomer(Long id) {
        if (!repository.existsById(id)) throw new CustomerNotFoundException(id);
        repository.deleteById(id);
    }

    @Override
    public CustomerResponseDTO getCustomerById(Long id) {
        return repository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new CustomerNotFoundException(id));
    }

    @Override
    public List<CustomerResponseDTO> getAllCustomers() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}

