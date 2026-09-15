package com.kkeedsoft.kahraman_twin_api.workorder;

public class WorkOrderNotFoundException extends RuntimeException {
    public WorkOrderNotFoundException(String id) {
        super("İş emri bulunamadı: " + id);
    }
}
