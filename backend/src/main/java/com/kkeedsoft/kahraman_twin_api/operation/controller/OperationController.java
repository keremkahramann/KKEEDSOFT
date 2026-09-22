package com.kkeedsoft.kahraman_twin_api.operation.controller;

import jakarta.validation.Valid;
import com.kkeedsoft.kahraman_twin_api.common.dto.*;
import com.kkeedsoft.kahraman_twin_api.operation.model.Operation;
import com.kkeedsoft.kahraman_twin_api.reporting.service.CatalogService;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

@RestController
@Profile("local")
@RequestMapping("/api/v1/operations")
public class OperationController {
    private final CatalogService service;
    public OperationController(CatalogService service) { this.service = service; }
    @GetMapping
    public PageResponse<Operation> list(@Valid @ModelAttribute CatalogQuery query) { return service.operations(query); }
    @GetMapping("/{id}")
    public Operation get(@PathVariable String id) { return service.operation(id); }
}
