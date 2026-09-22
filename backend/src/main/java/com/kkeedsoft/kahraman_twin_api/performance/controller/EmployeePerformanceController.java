package com.kkeedsoft.kahraman_twin_api.performance.controller;

import jakarta.validation.Valid;
import com.kkeedsoft.kahraman_twin_api.performance.dto.*;
import com.kkeedsoft.kahraman_twin_api.performance.service.PerformanceService;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

@RestController
@Profile("local")
@RequestMapping("/api/v1/performance/employees")
public class EmployeePerformanceController {
    private final PerformanceService service;
    public EmployeePerformanceController(PerformanceService service) { this.service = service; }
    @GetMapping("/top")
    public PerformanceResponse top(@Valid @ModelAttribute PerformanceQuery query) { return service.employees(query, true); }
    @GetMapping("/bottom")
    public PerformanceResponse bottom(@Valid @ModelAttribute PerformanceQuery query) { return service.employees(query, false); }
}
