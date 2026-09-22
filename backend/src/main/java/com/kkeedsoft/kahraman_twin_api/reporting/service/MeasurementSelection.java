package com.kkeedsoft.kahraman_twin_api.reporting.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import com.kkeedsoft.kahraman_twin_api.common.ResourceNotFoundException;
import com.kkeedsoft.kahraman_twin_api.production.model.ProductionMeasurement;
import com.kkeedsoft.kahraman_twin_api.reporting.model.ReportSnapshot;

public final class MeasurementSelection {
    public static final ZoneId ZONE = ZoneId.of("Europe/Istanbul");
    private MeasurementSelection() { }

    public static List<ProductionMeasurement> select(ReportSnapshot snapshot, LocalDate from, LocalDate to,
            String employeeId, String operationId) {
        if (employeeId != null && snapshot.employees().stream().noneMatch(e -> e.id().equals(employeeId)))
            throw new ResourceNotFoundException("Personel", employeeId);
        if (operationId != null && snapshot.operations().stream().noneMatch(o -> o.id().equals(operationId)))
            throw new ResourceNotFoundException("Operasyon", operationId);
        return snapshot.measurements().stream().filter(row -> {
            var date = row.recordedAt().atZone(ZONE).toLocalDate();
            return !date.isBefore(from) && !date.isAfter(to)
                    && (employeeId == null || employeeId.equals(row.employeeId()))
                    && (operationId == null || operationId.equals(row.operationId()));
        }).toList();
    }
}
