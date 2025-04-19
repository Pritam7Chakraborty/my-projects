package com.pritam.carrental.service;

import com.pritam.carrental.dto.BookingRequestDTO;
import com.pritam.carrental.dto.BookingResponseDTO;
import com.pritam.carrental.entity.*;
import com.pritam.carrental.repository.BookingRepository;
import com.pritam.carrental.repository.CarRepository;
import com.pritam.carrental.repository.CustomerRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final CarRepository carRepository;

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO dto) {
        Car car = carRepository.findById(dto.getCarId()).orElseThrow(() -> new EntityNotFoundException("Car not found"));
        Customer customer = customerRepository.findById(dto.getCustomerId()).orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        var overlaps = bookingRepository.findOverlappingBookings(car.getId(), dto.getStartDate(), dto.getEndDate());
        if (!overlaps.isEmpty()) {
            throw new RuntimeException("Car is already booked during the selected period.");
        }

        long days = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;
        double pricePerDay = car.getDailyRentPrice();

        Booking booking = Booking.builder()
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .car(car)
                .customer(customer)
                .totalAmount(days * pricePerDay)
                .status(BookingStatus.PENDING)
                .build();

        return toDTO(bookingRepository.save(booking));
    }

    @Override
    public BookingResponseDTO getBookingById(Long id) {
        return bookingRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public BookingResponseDTO updateBooking(Long id, BookingRequestDTO dto) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Booking not found"));

        Car car = carRepository.findById(dto.getCarId()).orElseThrow(() -> new EntityNotFoundException("Car not found"));
        Customer customer = customerRepository.findById(dto.getCustomerId()).orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        booking.setStartDate(dto.getStartDate());
        booking.setEndDate(dto.getEndDate());
        booking.setCar(car);
        booking.setCustomer(customer);

        long days = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;
        booking.setTotalAmount(days * car.getDailyRentPrice());

        return toDTO(bookingRepository.save(booking));
    }

    @Override
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    @Override
    public BookingResponseDTO updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Booking not found"));
        booking.setStatus(status);
        return toDTO(bookingRepository.save(booking));
    }

    private BookingResponseDTO toDTO(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .carId(booking.getCar().getId())
                .carModel(booking.getCar().getName())
                .customerId(booking.getCustomer().getId())
                .customerName(booking.getCustomer().getFullName())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .build();
    }
}
