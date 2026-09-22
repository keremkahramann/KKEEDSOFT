package com.kkeedsoft.kahraman_twin_api.production.model;

import java.math.BigDecimal;
import java.time.Instant;

/** Null score means missing/invalid source score, never zero. Durations are seconds. */
public record ProductionMeasurement(
        String sourceRecordId, String employeeId, String operationId,
        Instant recordedAt, String shiftId, String machineId, String workOrderId,
        BigDecimal performanceScore, BigDecimal quantity,
        BigDecimal actualDurationSeconds, BigDecimal standardDurationSeconds,
        Instant sourceUpdatedAt, Instant importedAt) { }
