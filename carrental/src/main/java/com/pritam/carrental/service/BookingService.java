package com.pritam.carrental.service;

import com.pritam.carrental.dto.BookingRequestDTO;
import com.pritam.carrental.dto.BookingResponseDTO;

import java.util.List;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequestDTO requestDTO);

    BookingResponseDTO getBookingById(Long id);

    List<BookingResponseDTO> getAllBookings();

    void deleteBooking(Long id);
}
