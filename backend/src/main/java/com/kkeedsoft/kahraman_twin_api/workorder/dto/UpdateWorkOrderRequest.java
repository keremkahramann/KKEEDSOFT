package com.kkeedsoft.kahraman_twin_api.workorder.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.*;

/** Düzenlenebilir plan alanlarının tamamı gönderilir; üretim miktarı ayrı güncellenir. */
public record UpdateWorkOrderRequest(
        @NotBlank @Size(max = 200) String product,
        @NotBlank @Size(max = 200) String customer,
        @NotNull @Positive @Max(9007199254740991L) Long qty,
        @NotNull LocalDate deadline,
        @NotBlank @Size(max = 200) String machine) { }
