package com.kkeedsoft.kahraman_twin_api.performance.controller;

import jakarta.validation.Valid;
import com.kkeedsoft.kahraman_twin_api.performance.dto.*;
import com.kkeedsoft.kahraman_twin_api.performance.service.PerformanceService;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

@RestController
@Profile("local")
@RequestMapping("/api/v1/performance/operations")
public class OperationPerformanceController {
    private final PerformanceService service;
    public OperationPerformanceController(PerformanceService service) { this.service = service; }
    @GetMapping("/bottom")
    public PerformanceResponse bottom(@Valid @ModelAttribute PerformanceQuery query) { return service.operations(query); }
}
