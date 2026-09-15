package com.kkeedsoft.kahraman_twin_api.workorder.dto;

import com.kkeedsoft.kahraman_twin_api.workorder.WorkOrder.Risk;
import jakarta.validation.constraints.*;

public record ListWorkOrdersRequest(
        @Size(max = 100) String q,
        Risk risk,
        @Min(0) Integer page,
        @Min(1) @Max(100) Integer size) {
    public ListWorkOrdersRequest {
        q = q == null ? "" : q.trim();
        page = page == null ? 0 : page;
        size = size == null ? 20 : size;
    }
}
