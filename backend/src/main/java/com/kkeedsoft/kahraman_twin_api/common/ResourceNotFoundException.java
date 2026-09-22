package com.kkeedsoft.kahraman_twin_api.common;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, String id) {
        super(resource + " bulunamadı: " + id);
    }
}
