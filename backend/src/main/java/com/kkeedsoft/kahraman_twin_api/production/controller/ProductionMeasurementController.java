package com.kkeedsoft.kahraman_twin_api.production.controller;

import jakarta.validation.Valid;
import com.kkeedsoft.kahraman_twin_api.common.dto.PageResponse;
import com.kkeedsoft.kahraman_twin_api.production.dto.MeasurementQuery;
import com.kkeedsoft.kahraman_twin_api.production.model.ProductionMeasurement;
import com.kkeedsoft.kahraman_twin_api.production.service.MeasurementService;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

@RestController
@Profile("local")
@RequestMapping("/api/v1/production/measurements")
public class ProductionMeasurementController {
    private final MeasurementService service;
    public ProductionMeasurementController(MeasurementService service) { this.service = service; }
    @GetMapping
    public PageResponse<ProductionMeasurement> list(@Valid @ModelAttribute MeasurementQuery query) {
        return service.list(query);
    }
}
