package com.kkeedsoft.kahraman_twin_api.common.dto;

import jakarta.validation.constraints.*;

public record CatalogQuery(@Size(max = 100) String q, @Min(0) Integer page,
        @Min(1) @Max(100) Integer size) {
    public CatalogQuery {
        q = q == null ? "" : q.trim();
        page = page == null ? 0 : page;
        size = size == null ? 20 : size;
    }
}
