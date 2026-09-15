package com.kkeedsoft.kahraman_twin_api.workorder;

public class InvalidWorkOrderException extends RuntimeException {
    public InvalidWorkOrderException(String message) {
        super(message);
    }
}
