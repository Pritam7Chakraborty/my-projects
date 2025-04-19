package com.pritam.carrental.controller;

import com.pritam.carrental.dto.BookingRequestDTO;
import com.pritam.carrental.dto.BookingResponseDTO;
import com.pritam.carrental.payload.ApiResponse;
import com.pritam.carrental.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> createBooking(@Valid @RequestBody BookingRequestDTO dto) {
        BookingResponseDTO response = bookingService.createBooking(dto);
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> getBooking(@PathVariable Long id) {
        BookingResponseDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success("Booking fetched", booking));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getAllBookings() {
        List<BookingResponseDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success("All bookings retrieved", bookings));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking deleted successfully", null));
    }
}
