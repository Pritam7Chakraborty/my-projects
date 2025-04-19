package com.pritam.carrental.repository;

import com.pritam.carrental.entity.Car;
import com.pritam.carrental.entity.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<Car,Long> {
    List<Car> findByStatus(CarStatus status);
}
