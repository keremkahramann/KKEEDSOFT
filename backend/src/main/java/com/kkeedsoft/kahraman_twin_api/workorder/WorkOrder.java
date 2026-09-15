package com.kkeedsoft.kahraman_twin_api.workorder;

import java.time.LocalDate;

/** Yerel geliştirme modeli; ERP tablosu veya JPA entity'si değildir. */
public record WorkOrder(
        String id, String product, String customer, long qty, long done,
        Status status, Risk risk, LocalDate deadline, String machine) {

    // Mevcut UI sözleşmesindeki değerler; şirketin nihai durum listesi değil.
    public enum Status { in_progress }
    public enum Risk { none, warning, critical }
}
