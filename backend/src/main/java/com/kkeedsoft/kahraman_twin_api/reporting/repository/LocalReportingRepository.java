package com.kkeedsoft.kahraman_twin_api.reporting.repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import com.kkeedsoft.kahraman_twin_api.employee.model.Employee;
import com.kkeedsoft.kahraman_twin_api.operation.model.Operation;
import com.kkeedsoft.kahraman_twin_api.production.model.ProductionMeasurement;
import com.kkeedsoft.kahraman_twin_api.reporting.model.ReportSnapshot;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

@Repository
@Profile("local")
public class LocalReportingRepository implements ReportingRepository {
    private final ReportSnapshot snapshot;

    public LocalReportingRepository() {
        var employees = List.of(
                new Employee("EMP-001", "Örnek Ali", "URETIM", true),
                new Employee("EMP-002", "Örnek Ayşe", "URETIM", true),
                new Employee("EMP-003", "Örnek Can", "MONTAJ", true),
                new Employee("EMP-004", "Örnek Deniz", "MONTAJ", true),
                new Employee("EMP-005", "Örnek Ece", "KALITE", true),
                new Employee("EMP-006", "Örnek Fatma", "KALITE", true));
        var operations = List.of(
                new Operation("OP-001", "KES-01", "Örnek kesim", true),
                new Operation("OP-002", "MON-01", "Örnek montaj", true),
                new Operation("OP-003", "BOY-01", "Örnek boya", true),
                new Operation("OP-004", "PAK-01", "Örnek paketleme", true),
                new Operation("OP-005", "KON-01", "Örnek kontrol", true),
                new Operation("OP-006", "PRES-01", "Örnek pres", true));
        var rows = new ArrayList<ProductionMeasurement>();
        int[] scores = {100, 70, 60, 40, 30, 20};
        for (int i = 0; i < scores.length; i++) {
            rows.add(measurement("DEMO-" + (i + 1), employees.get(i).id(),
                    operations.get(i).id(), BigDecimal.valueOf(scores[i])));
        }
        rows.add(measurement("DEMO-7", "EMP-001", "OP-001", BigDecimal.ZERO));
        rows.add(measurement("DEMO-8", "EMP-001", "OP-001", BigDecimal.valueOf(-20)));
        rows.add(measurement("DEMO-9", "EMP-002", "OP-002", null));
        rows.add(measurement("DEMO-10", null, "OP-003", BigDecimal.valueOf(80)));
        rows.add(measurement("DEMO-11", "EMP-003", null, BigDecimal.valueOf(40)));
        snapshot = new ReportSnapshot("LOCAL_DEMO", "demo-performance-v1", null, employees, operations, rows);
    }

    private static ProductionMeasurement measurement(String id, String employeeId, String operationId, BigDecimal score) {
        var time = Instant.parse("2026-09-21T09:00:00Z");
        return new ProductionMeasurement(id, employeeId, operationId, time, "SHIFT-A", "MACHINE-DEMO",
                null, score, null, null, null, time, null);
    }

    @Override
    public ReportSnapshot snapshot() { return snapshot; }
}
