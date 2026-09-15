package com.kkeedsoft.kahraman_twin_api.workorder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.UnaryOperator;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

@Repository
@Profile("local")
public class InMemoryWorkOrderRepository implements WorkOrderRepository {
    private final ConcurrentHashMap<String, WorkOrder> orders = new ConcurrentHashMap<>();

    public InMemoryWorkOrderRepository() {
        create(new WorkOrder("WO-2026-1048", "PRT-1042 Muhafaza Kapağı", "Örnek müşteri A",
                1500000, 938400, WorkOrder.Status.in_progress, WorkOrder.Risk.critical,
                LocalDate.of(2026, 9, 10), "INJ-01 / PRESS-07"));
        create(new WorkOrder("WO-2026-1031", "MTL-0887 Bağlantı Braketi", "Örnek müşteri B",
                84000, 37000, WorkOrder.Status.in_progress, WorkOrder.Risk.warning,
                LocalDate.of(2026, 9, 12), "PRESS-01"));
        create(new WorkOrder("WO-2026-1040", "KLP-2201 Hassas Kalıp", "Örnek iç üretim",
                1, 0, WorkOrder.Status.in_progress, WorkOrder.Risk.none,
                LocalDate.of(2026, 9, 20), "MOLD-01"));
    }

    @Override
    public List<WorkOrder> findAll() {
        return List.copyOf(orders.values());
    }

    @Override
    public Optional<WorkOrder> findById(String id) {
        return Optional.ofNullable(orders.get(id));
    }

    @Override
    public WorkOrder create(WorkOrder order) {
        if (orders.putIfAbsent(order.id(), order) != null) {
            throw new InvalidWorkOrderException("Bu kimlikle bir iş emri zaten var.");
        }
        return order;
    }

    @Override
    public WorkOrder update(String id, UnaryOperator<WorkOrder> change) {
        // Aynı kayıttaki kontrol ve değişikliği birlikte yapar.
        return orders.compute(id, (key, existing) -> {
            if (existing == null) throw new WorkOrderNotFoundException(id);
            return change.apply(existing);
        });
    }
}
