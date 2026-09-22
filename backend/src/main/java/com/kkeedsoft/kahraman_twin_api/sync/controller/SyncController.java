package com.kkeedsoft.kahraman_twin_api.sync.controller;

import com.kkeedsoft.kahraman_twin_api.sync.model.SyncStatus;
import com.kkeedsoft.kahraman_twin_api.sync.service.SyncStatusService;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

@RestController
@Profile("local")
@RequestMapping("/api/v1/sync")
public class SyncController {
    private final SyncStatusService service;
    public SyncController(SyncStatusService service) { this.service = service; }
    @GetMapping("/status")
    public SyncStatus status() { return service.status(); }
}
