package com.pritam.carrental.service;

import com.pritam.carrental.dto.CustomerDTO;
import com.pritam.carrental.entity.Customer;
import com.pritam.carrental.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerDTO createCustomer(CustomerDTO dto) {
        Customer customer = Customer.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .build();

        Customer saved = customerRepository.save(customer);
        log.info("Created customer: {}", saved.getEmail());

        return CustomerDTO.fromEntity(saved);
    }

    public List<CustomerDTO> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        log.info("Fetched all customers: {}", customers.size());
        return customers.stream()
                .map(CustomerDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CustomerDTO updateCustomer(Long id, CustomerDTO dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());

        Customer updated = customerRepository.save(customer);
        log.info("Updated customer: {}", updated.getEmail());

        return CustomerDTO.fromEntity(updated);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
        log.info("Deleted customer with ID {}", id);
    }
}
