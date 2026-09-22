package com.kkeedsoft.kahraman_twin_api.sync.model;

import java.time.Instant;

public record SyncStatus(String state, String dataSource, String dataVersion,
        Instant lastSuccessfulSyncAt, Instant nextScheduledAt, String message) { }
