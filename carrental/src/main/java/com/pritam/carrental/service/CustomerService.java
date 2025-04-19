package com.pritam.carrental.service;

import com.pritam.carrental.dto.CustomerRequestDTO;
import com.pritam.carrental.dto.CustomerResponseDTO;

import java.util.List;

public interface CustomerService {
    CustomerResponseDTO  createCustomer(CustomerRequestDTO dto);
    CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO dto);
    void deleteCustomer(Long id);
    CustomerResponseDTO getCustomerById(Long id);
    List<CustomerResponseDTO> getAllCustomers();
}
