package com.kkeedsoft.kahraman_twin_api.workorder.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/** Artış miktarı değil, toplam tamamlanan miktar gönderilir. */
public record UpdateWorkOrderProgressRequest(
        @NotNull @PositiveOrZero @Max(9007199254740991L) Long done) { }
