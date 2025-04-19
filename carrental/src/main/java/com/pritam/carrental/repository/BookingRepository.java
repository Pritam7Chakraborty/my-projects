package com.pritam.carrental.repository;

import com.pritam.carrental.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId AND " +
            "(:startDate BETWEEN b.startDate AND b.endDate OR " +
            ":endDate BETWEEN b.startDate AND b.endDate OR " +
            "b.startDate BETWEEN :startDate AND :endDate)")
    List<Booking> findOverlappingBookings(@Param("carId") Long carId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);
}
