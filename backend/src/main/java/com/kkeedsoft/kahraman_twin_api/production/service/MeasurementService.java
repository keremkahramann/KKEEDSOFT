package com.kkeedsoft.kahraman_twin_api.production.service;

import java.util.Comparator;
import com.kkeedsoft.kahraman_twin_api.common.dto.PageResponse;
import com.kkeedsoft.kahraman_twin_api.production.dto.MeasurementQuery;
import com.kkeedsoft.kahraman_twin_api.production.model.ProductionMeasurement;
import com.kkeedsoft.kahraman_twin_api.reporting.repository.ReportingRepository;
import com.kkeedsoft.kahraman_twin_api.reporting.service.MeasurementSelection;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("local")
public class MeasurementService {
    private final ReportingRepository repository;
    public MeasurementService(ReportingRepository repository) { this.repository = repository; }
    public PageResponse<ProductionMeasurement> list(MeasurementQuery query) {
        var snapshot = repository.snapshot();
        var rows = MeasurementSelection.select(snapshot, query.from(), query.to(), query.employeeId(), query.operationId());
        var items = rows.stream().sorted(Comparator.comparing(ProductionMeasurement::recordedAt)
                .thenComparing(ProductionMeasurement::sourceRecordId))
                .skip((long) query.page() * query.size()).limit(query.size()).toList();
        return new PageResponse<>(items, rows.size(), query.page(), query.size(), snapshot.dataSource(), snapshot.dataVersion());
    }
}
