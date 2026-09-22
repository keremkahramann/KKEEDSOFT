package com.kkeedsoft.kahraman_twin_api.performance.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

public record PerformanceQuery(
        @NotNull @DateTimeFormat(iso = ISO.DATE) LocalDate from,
        @NotNull @DateTimeFormat(iso = ISO.DATE) LocalDate to,
        @Size(max = 100) String employeeId, @Size(max = 100) String operationId,
        @Min(1) @Max(100) Integer limit) {
    public PerformanceQuery {
        limit = limit == null ? 5 : limit;
        employeeId = employeeId == null || employeeId.isBlank() ? null : employeeId.trim();
        operationId = operationId == null || operationId.isBlank() ? null : operationId.trim();
    }

    @AssertTrue(message = "Başlangıç tarihi bitiş tarihinden sonra olamaz.")
    public boolean isDateRangeValid() { return from == null || to == null || !from.isAfter(to); }
}
