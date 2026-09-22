package com.kkeedsoft.kahraman_twin_api.performance.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.text.Collator;
import java.util.*;
import com.kkeedsoft.kahraman_twin_api.performance.dto.*;
import com.kkeedsoft.kahraman_twin_api.reporting.repository.ReportingRepository;
import com.kkeedsoft.kahraman_twin_api.reporting.service.MeasurementSelection;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("local")
public class PerformanceService {
    private final ReportingRepository repository;
    public PerformanceService(ReportingRepository repository) { this.repository = repository; }

    public PerformanceResponse employees(PerformanceQuery query, boolean descending) {
        return rank(query, false, descending);
    }

    public PerformanceResponse operations(PerformanceQuery query) {
        return rank(query, true, false);
    }

    private PerformanceResponse rank(PerformanceQuery query, boolean operations, boolean descending) {
        var snapshot = repository.snapshot();
        var selected = MeasurementSelection.select(snapshot, query.from(), query.to(), query.employeeId(), query.operationId());
        Map<String, String> names = new HashMap<>();
        Map<String, String> codes = new HashMap<>();
        if (operations) snapshot.operations().forEach(o -> { names.put(o.id(), o.name()); codes.put(o.id(), o.code()); });
        else snapshot.employees().forEach(e -> names.put(e.id(), e.name()));
        Map<String, Aggregate> groups = new HashMap<>();
        long invalid = 0, missing = 0, nonPositive = 0, included = 0;
        for (var row : selected) {
            var score = row.performanceScore();
            if (score == null) { invalid++; continue; }
            if (operations && score.signum() <= 0) { nonPositive++; continue; }
            var id = operations ? row.operationId() : row.employeeId();
            if (id == null || !names.containsKey(id)) { missing++; continue; }
            groups.computeIfAbsent(id, ignored -> new Aggregate()).add(score);
            included++;
        }
        var collator = Collator.getInstance(Locale.forLanguageTag("tr-TR"));
        Comparator<PerformanceResponse.Item> byScore = Comparator.comparing(PerformanceResponse.Item::averageScore);
        if (descending) byScore = byScore.reversed();
        var ordering = byScore.thenComparing(PerformanceResponse.Item::name, collator)
                .thenComparing(PerformanceResponse.Item::id);
        var items = groups.entrySet().stream().map(entry -> new PerformanceResponse.Item(entry.getKey(),
                names.get(entry.getKey()), codes.get(entry.getKey()), entry.getValue().average(), entry.getValue().count))
                .sorted(ordering).limit(query.limit()).toList();
        var metadata = new PerformanceResponse.Metadata(query.from(), query.to(), MeasurementSelection.ZONE.getId(),
                query.employeeId(), query.operationId(), query.limit(),
                operations ? "POSITIVE_ONLY" : "ALL_NUMERIC", descending ? "DESC" : "ASC",
                selected.size(), included, invalid, missing, nonPositive, groups.size(),
                snapshot.dataSource(), snapshot.dataVersion(), "arithmetic-mean-v1", snapshot.lastSuccessfulSyncAt());
        return new PerformanceResponse(items, metadata);
    }

    private static class Aggregate {
        private BigDecimal sum = BigDecimal.ZERO;
        private long count;
        void add(BigDecimal score) { sum = sum.add(score); count++; }
        BigDecimal average() { return sum.divide(BigDecimal.valueOf(count), MathContext.DECIMAL128); }
    }
}
