package com.kkeedsoft.kahraman_twin_api.workorder;

import java.util.Comparator;
import java.util.Locale;
import java.util.UUID;
import com.kkeedsoft.kahraman_twin_api.workorder.dto.*;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("local")
public class WorkOrderService {
    private static final Locale TURKISH = Locale.forLanguageTag("tr-TR");
    private final WorkOrderRepository repository;

    public WorkOrderService(WorkOrderRepository repository) {
        this.repository = repository;
    }

    public WorkOrderPageResponse list(ListWorkOrdersRequest request) {
        String query = request.q().toLowerCase(TURKISH);
        var matching = repository.findAll().stream()
                .filter(order -> request.risk() == null || order.risk() == request.risk())
                .filter(order -> (order.id() + " " + order.product() + " " + order.customer())
                        .toLowerCase(TURKISH).contains(query))
                .sorted(Comparator.comparing(WorkOrder::id))
                .toList();
        var items = matching.stream().skip((long) request.page() * request.size())
                .limit(request.size()).map(WorkOrderResponse::from).toList();
        return new WorkOrderPageResponse(items, matching.size(), request.page(), request.size());
    }

    public WorkOrderResponse get(String id) {
        return WorkOrderResponse.from(repository.findById(id)
                .orElseThrow(() -> new WorkOrderNotFoundException(id)));
    }

    public WorkOrderResponse create(CreateWorkOrderRequest request) {
        var order = new WorkOrder("WO-LOCAL-" + UUID.randomUUID(), request.product().trim(),
                request.customer().trim(), request.qty(), 0, WorkOrder.Status.in_progress,
                WorkOrder.Risk.none, request.deadline(), request.machine().trim());
        return WorkOrderResponse.from(repository.create(order));
    }

    public WorkOrderResponse update(String id, UpdateWorkOrderRequest request) {
        return WorkOrderResponse.from(repository.update(id, existing -> {
            validateProgress(request.qty(), existing.done());
            return new WorkOrder(id, request.product().trim(), request.customer().trim(), request.qty(),
                    existing.done(), existing.status(), existing.risk(), request.deadline(), request.machine().trim());
        }));
    }

    public WorkOrderResponse updateProgress(String id, UpdateWorkOrderProgressRequest request) {
        return WorkOrderResponse.from(repository.update(id, existing -> {
            validateProgress(existing.qty(), request.done());
            return new WorkOrder(id, existing.product(), existing.customer(), existing.qty(), request.done(),
                    existing.status(), existing.risk(), existing.deadline(), existing.machine());
        }));
    }

    private void validateProgress(long qty, long done) {
        if (done > qty) {
            throw new InvalidWorkOrderException("Tamamlanan miktar, iş emri miktarını aşamaz.");
        }
    }
}
