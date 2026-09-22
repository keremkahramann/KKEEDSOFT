package com.kkeedsoft.kahraman_twin_api.workorder.controller;

import java.net.URI;
import com.kkeedsoft.kahraman_twin_api.workorder.WorkOrderService;
import jakarta.validation.Valid;
import com.kkeedsoft.kahraman_twin_api.workorder.dto.*;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/work-orders", "/api/work-orders"})
@Profile("local")
public class WorkOrderController {
    private final WorkOrderService service;

    public WorkOrderController(WorkOrderService service) {
        this.service = service;
    }

    @GetMapping
    public WorkOrderPageResponse list(@Valid @ModelAttribute ListWorkOrdersRequest request) {
        return service.list(request);
    }

    @GetMapping("/{id}")
    public WorkOrderResponse get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<WorkOrderResponse> create(@Valid @RequestBody CreateWorkOrderRequest request) {
        var response = service.create(request);
        return ResponseEntity.created(URI.create("/api/v1/work-orders/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public WorkOrderResponse update(@PathVariable String id, @Valid @RequestBody UpdateWorkOrderRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/progress")
    public WorkOrderResponse progress(@PathVariable String id,
            @Valid @RequestBody UpdateWorkOrderProgressRequest request) {
        return service.updateProgress(id, request);
    }
}
