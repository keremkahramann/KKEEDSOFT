package com.kkeedsoft.kahraman_twin_api.workorder.dto;

import java.util.List;

public record WorkOrderPageResponse(List<WorkOrderResponse> items, long total, int page, int size) { }
