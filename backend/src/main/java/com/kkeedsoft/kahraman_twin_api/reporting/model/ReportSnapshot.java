package com.kkeedsoft.kahraman_twin_api.reporting.model;

import java.time.Instant;
import java.util.List;
import com.kkeedsoft.kahraman_twin_api.employee.model.Employee;
import com.kkeedsoft.kahraman_twin_api.operation.model.Operation;
import com.kkeedsoft.kahraman_twin_api.production.model.ProductionMeasurement;

/** One immutable published dataset. A future importer must publish atomically. */
public record ReportSnapshot(String dataSource, String dataVersion, Instant lastSuccessfulSyncAt,
        List<Employee> employees, List<Operation> operations, List<ProductionMeasurement> measurements) {
    public ReportSnapshot {
        employees = List.copyOf(employees);
        operations = List.copyOf(operations);
        measurements = List.copyOf(measurements);
    }
}
