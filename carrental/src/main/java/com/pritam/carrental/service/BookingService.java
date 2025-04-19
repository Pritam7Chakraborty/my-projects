package com.pritam.carrental.service;

import com.pritam.carrental.dto.BookingRequestDTO;
import com.pritam.carrental.dto.BookingResponseDTO;
import com.pritam.carrental.entity.Booking;
import com.pritam.carrental.entity.Car;
import com.pritam.carrental.entity.Customer;
import com.pritam.carrental.enums.BookingStatus;
import com.pritam.carrental.enums.CarStatus;
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
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final CustomerRepository customerRepository;

    public BookingResponseDTO createBooking(BookingRequestDTO dto) {
        Car car = carRepository.findById(dto.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (car.getStatus() != CarStatus.AVAILABLE) {
            throw new RuntimeException("Car not available for booking");
        }

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Booking booking = Booking.builder()
                .car(car)
                .customer(customer)
                .fromDate(dto.getFromDate())
                .toDate(dto.getToDate())
                .status(BookingStatus.BOOKED)
                .createdAt(LocalDate.now())
                .build();

        car.setStatus(CarStatus.BOOKED);
        carRepository.save(car);

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created: ID {} for car {} by customer {}", saved.getId(), car.getNumber(), customer.getEmail());

        return BookingResponseDTO.fromEntity(saved);
    }

    public List<BookingResponseDTO> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        log.info("Fetched all bookings: {}", bookings.size());
        return bookings.stream()
                .map(BookingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        Car car = booking.getCar();
        car.setStatus(CarStatus.AVAILABLE);
        carRepository.save(car);

        log.info("Booking cancelled: ID {}", bookingId);
    }
}
