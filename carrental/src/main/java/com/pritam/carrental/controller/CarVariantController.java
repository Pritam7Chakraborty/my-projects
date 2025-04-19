package com.pritam.carrental.controller;

import com.pritam.carrental.entity.CarVariant;
import com.pritam.carrental.service.CarVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variants")
@CrossOrigin(origins = "*")
public class CarVariantController {

    @Autowired
    private CarVariantService carVariantService;

    @PostMapping
    public ResponseEntity<CarVariant> create(@RequestBody CarVariant variant) {
        return ResponseEntity.ok(carVariantService.createCarVariant(variant));
    }

    @GetMapping
    public ResponseEntity<List<CarVariant>> getAll() {
        return ResponseEntity.ok(carVariantService.getAllVariants());
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<CarVariant>> getByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(carVariantService.getVariantsByCompanyId(companyId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarVariant> update(@PathVariable Long id, @RequestBody CarVariant variant) {
        return ResponseEntity.ok(carVariantService.updateCarVariant(id, variant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        carVariantService.deleteCarVariant(id);
        return ResponseEntity.noContent().build();
    }
}
