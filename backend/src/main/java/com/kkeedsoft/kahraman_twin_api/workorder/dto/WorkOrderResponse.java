package com.kkeedsoft.kahraman_twin_api.workorder.dto;

import java.time.LocalDate;
import com.kkeedsoft.kahraman_twin_api.workorder.WorkOrder;

public record WorkOrderResponse(
        String id, String product, String customer, long qty, long done,
        WorkOrder.Status status, WorkOrder.Risk risk, LocalDate deadline, String machine) {
    public static WorkOrderResponse from(WorkOrder order) {
        return new WorkOrderResponse(order.id(), order.product(), order.customer(),
                order.qty(), order.done(), order.status(), order.risk(), order.deadline(), order.machine());
    }
}
