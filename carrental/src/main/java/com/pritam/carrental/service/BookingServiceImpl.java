package com.pritam.carrental.service;

import com.pritam.carrental.dto.BookingRequestDTO;
import com.pritam.carrental.dto.BookingResponseDTO;
import com.pritam.carrental.entity.Booking;
import com.pritam.carrental.entity.Car;
import com.pritam.carrental.entity.Customer;
import com.pritam.carrental.entity.BookingStatus;
import com.pritam.carrental.entity.CarStatus;
import com.pritam.carrental.repository.BookingRepository;
import com.pritam.carrental.repository.CarRepository;
import com.pritam.carrental.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final CustomerRepository customerRepository;

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO) {
        Car car = carRepository.findById(requestDTO.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (!car.getStatus().equals(CarStatus.AVAILABLE)) {
            throw new RuntimeException("Car is not available for booking");
        }

        Customer customer = customerRepository.findById(requestDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Booking booking = Booking.builder()
                .car(car)
                .customer(customer)
                .startDate(requestDTO.getStartDate())
                .endDate(requestDTO.getEndDate())
                .totalAmount(requestDTO.getTotalAmount())
                .bookingDate(LocalDate.now())
                .status(BookingStatus.CONFIRMED)
                .build();

        car.setStatus(CarStatus.BOOKED);
        carRepository.save(car);

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created: {}", saved.getId());

        return toDTO(saved);
    }

    @Override
    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return toDTO(booking);
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Car car = booking.getCar();
        car.setStatus(CarStatus.AVAILABLE); // make car available again
        carRepository.save(car);

        bookingRepository.deleteById(id);
    }

    private BookingResponseDTO toDTO(Booking b) {
        return BookingResponseDTO.builder()
                .id(b.getId())
                .startDate(b.getStartDate())
                .endDate(b.getEndDate())
                .customerId(b.getCustomer().getId())
                .customerName(b.getCustomer().getFullName())
                .carId(b.getCar().getId())
                .carModel(b.getCar().getName())
                .totalAmount(b.getTotalAmount())
                .status(b.getStatus())
                .build();
    }
}
