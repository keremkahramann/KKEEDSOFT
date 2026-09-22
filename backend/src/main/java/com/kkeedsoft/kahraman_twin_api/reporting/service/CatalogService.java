package com.kkeedsoft.kahraman_twin_api.reporting.service;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import com.kkeedsoft.kahraman_twin_api.common.ResourceNotFoundException;
import com.kkeedsoft.kahraman_twin_api.common.dto.*;
import com.kkeedsoft.kahraman_twin_api.employee.model.Employee;
import com.kkeedsoft.kahraman_twin_api.operation.model.Operation;
import com.kkeedsoft.kahraman_twin_api.reporting.model.ReportSnapshot;
import com.kkeedsoft.kahraman_twin_api.reporting.repository.ReportingRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("local")
public class CatalogService {
    private final ReportingRepository repository;
    private static final Locale TURKISH = Locale.forLanguageTag("tr-TR");
    public CatalogService(ReportingRepository repository) { this.repository = repository; }

    public PageResponse<Employee> employees(CatalogQuery query) {
        var snapshot = repository.snapshot();
        var items = snapshot.employees().stream()
                .filter(e -> matches(e.id() + " " + e.name() + " " + e.departmentCode(), query.q()))
                .sorted(Comparator.comparing(Employee::id)).toList();
        return page(items, query, snapshot);
    }

    public Employee employee(String id) {
        return repository.snapshot().employees().stream().filter(e -> e.id().equals(id)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Personel", id));
    }

    public PageResponse<Operation> operations(CatalogQuery query) {
        var snapshot = repository.snapshot();
        var items = snapshot.operations().stream()
                .filter(o -> matches(o.id() + " " + o.code() + " " + o.name(), query.q()))
                .sorted(Comparator.comparing(Operation::id)).toList();
        return page(items, query, snapshot);
    }

    public Operation operation(String id) {
        return repository.snapshot().operations().stream().filter(o -> o.id().equals(id)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Operasyon", id));
    }

    private boolean matches(String text, String query) {
        return text.toLowerCase(TURKISH).contains(query.toLowerCase(TURKISH));
    }

    private <T> PageResponse<T> page(List<T> items, CatalogQuery query, ReportSnapshot snapshot) {
        return new PageResponse<>(items.stream().skip((long) query.page() * query.size())
                .limit(query.size()).toList(), items.size(), query.page(), query.size(),
                snapshot.dataSource(), snapshot.dataVersion());
    }
}
