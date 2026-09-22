package com.kkeedsoft.kahraman_twin_api.performance.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record PerformanceResponse(List<Item> items, Metadata metadata) {
    public record Item(String id, String name, String code, BigDecimal averageScore, long measurementCount) { }
    public record Metadata(LocalDate from, LocalDate to, String timeZone,
            String employeeId, String operationId, int limit, String scoreRule, String order,
            long matchedMeasurements, long includedMeasurements, long invalidScoreMeasurements,
            long missingIdentityMeasurements, long nonPositiveMeasurements, long totalGroups,
            String dataSource, String dataVersion, String calculationVersion, Instant lastSuccessfulSyncAt) { }
}
