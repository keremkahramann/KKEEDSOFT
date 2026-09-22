package com.kkeedsoft.kahraman_twin_api.performance;

import static org.junit.jupiter.api.Assertions.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import com.kkeedsoft.kahraman_twin_api.employee.model.Employee;
import com.kkeedsoft.kahraman_twin_api.operation.model.Operation;
import com.kkeedsoft.kahraman_twin_api.production.model.ProductionMeasurement;
import com.kkeedsoft.kahraman_twin_api.reporting.model.ReportSnapshot;
import com.kkeedsoft.kahraman_twin_api.reporting.repository.LocalReportingRepository;
import com.kkeedsoft.kahraman_twin_api.performance.dto.PerformanceQuery;
import com.kkeedsoft.kahraman_twin_api.performance.service.PerformanceService;

class PerformanceServiceTests {
    private final LocalDate day = LocalDate.of(2026, 9, 21);

    @Test
    void excludesNonPositiveBeforeAveragingOperationsButKeepsThemForEmployees() {
        var service = new PerformanceService(new LocalReportingRepository());
        var query = new PerformanceQuery(day, day, null, "OP-001", 5);
        var operations = service.operations(query);
        assertEquals(0, operations.items().getFirst().averageScore().compareTo(new BigDecimal("100")));
        assertEquals(1, operations.items().getFirst().measurementCount());
        assertEquals(2, operations.metadata().nonPositiveMeasurements());
        var employees = service.employees(query, true);
        assertEquals(3, employees.items().getFirst().measurementCount());
        assertEquals(26.6666666667, employees.items().getFirst().averageScore().doubleValue(), 1e-9);
        assertEquals(0, employees.metadata().nonPositiveMeasurements());
    }

    @Test
    void ranksAllGroupsBeforeLimitingAndExclusionCountsReconcile() {
        var service = new PerformanceService(new LocalReportingRepository());
        var query = new PerformanceQuery(day, day, null, null, null);
        var top = service.employees(query, true);
        var bottom = service.employees(query, false);
        assertEquals(List.of("EMP-002", "EMP-003", "EMP-004", "EMP-005", "EMP-001"),
                top.items().stream().map(item -> item.id()).toList());
        assertEquals("EMP-006", bottom.items().getFirst().id());
        var operations = service.operations(query);
        assertEquals(5, operations.items().size());
        assertEquals("OP-006", operations.items().getFirst().id());
        var meta = operations.metadata();
        assertEquals(6, meta.totalGroups());
        assertEquals(meta.matchedMeasurements(), meta.includedMeasurements() + meta.invalidScoreMeasurements()
                + meta.missingIdentityMeasurements() + meta.nonPositiveMeasurements());
        assertEquals(7, meta.includedMeasurements());
        assertNull(meta.lastSuccessfulSyncAt());
    }

    @Test
    void sameNamesRemainSeparateAndDatesUseInclusiveIstanbulDays() {
        var employees = List.of(new Employee("A", "Aynı kişi", "D", true), new Employee("B", "Aynı kişi", "D", true));
        var operations = List.of(new Operation("O1", "E1", "F1", true), new Operation("O2", "E1", "F2", true));
        var rows = List.of(
                measurement("1", "B", "O1", "2026-09-20T21:00:00Z", "50"),
                measurement("2", "A", "O2", "2026-09-21T20:59:59Z", "50"),
                measurement("3", "A", "O2", "2026-09-21T21:00:00Z", "100"),
                measurement("4", "A", "O2", "2026-09-20T20:59:59Z", "100"));
        var snapshot = new ReportSnapshot("LOCAL_DEMO", "test-v1", null, employees, operations, rows);
        var service = new PerformanceService(() -> snapshot);
        var query = new PerformanceQuery(day, day, null, null, 5);
        var result = service.employees(query, true);
        assertEquals(List.of("A", "B"), result.items().stream().map(item -> item.id()).toList());
        assertEquals(2, result.metadata().matchedMeasurements());
        assertEquals(2, service.operations(query).items().size());
        assertTrue(service.operations(new PerformanceQuery(day.minusDays(5), day.minusDays(5), null, null, 5)).items().isEmpty());
    }

    @Test
    void decimalScoresAreNotRoundedBeforeAveragingAndMissingPeopleDoNotHideOperations() {
        var snapshot = new ReportSnapshot("LOCAL_DEMO", "test", null, List.of(),
                List.of(new Operation("O", "E", "F", true)), List.of(
                measurement("1", null, "O", "2026-09-21T00:00:00Z", "0.1"),
                measurement("2", null, "O", "2026-09-21T00:00:00Z", "0.2")));
        var result = new PerformanceService(() -> snapshot).operations(new PerformanceQuery(day, day, null, null, 5));
        assertEquals(0, result.items().getFirst().averageScore().compareTo(new BigDecimal("0.15")));
        assertEquals(2, result.items().getFirst().measurementCount());
    }

    private ProductionMeasurement measurement(String id, String employee, String operation, String time, String score) {
        return new ProductionMeasurement(id, employee, operation, Instant.parse(time), null, null, null,
                new BigDecimal(score), null, null, null, Instant.parse(time), null);
    }
}
