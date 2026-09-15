package com.kkeedsoft.kahraman_twin_api.workorder;

import java.util.List;
import java.util.Optional;
import java.util.function.UnaryOperator;

public interface WorkOrderRepository {
    List<WorkOrder> findAll();
    Optional<WorkOrder> findById(String id);
    WorkOrder create(WorkOrder order);
    WorkOrder update(String id, UnaryOperator<WorkOrder> change);
}
