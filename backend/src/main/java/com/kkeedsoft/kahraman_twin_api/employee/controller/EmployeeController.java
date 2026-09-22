package com.kkeedsoft.kahraman_twin_api.employee.controller;

import jakarta.validation.Valid;
import com.kkeedsoft.kahraman_twin_api.common.dto.*;
import com.kkeedsoft.kahraman_twin_api.employee.model.Employee;
import com.kkeedsoft.kahraman_twin_api.reporting.service.CatalogService;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

@RestController
@Profile("local")
@RequestMapping("/api/v1/employees")
public class EmployeeController {
    private final CatalogService service;
    public EmployeeController(CatalogService service) { this.service = service; }
    @GetMapping
    public PageResponse<Employee> list(@Valid @ModelAttribute CatalogQuery query) { return service.employees(query); }
    @GetMapping("/{id}")
    public Employee get(@PathVariable String id) { return service.employee(id); }
}
