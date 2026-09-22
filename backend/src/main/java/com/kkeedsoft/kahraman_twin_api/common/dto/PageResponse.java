package com.kkeedsoft.kahraman_twin_api.common.dto;

import java.util.List;

public record PageResponse<T>(List<T> items, long total, int page, int size,
        String dataSource, String dataVersion) { }
