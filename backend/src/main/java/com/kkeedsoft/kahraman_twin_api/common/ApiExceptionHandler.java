package com.kkeedsoft.kahraman_twin_api.common;

import java.util.LinkedHashMap;
import java.util.Map;
import com.kkeedsoft.kahraman_twin_api.workorder.InvalidWorkOrderException;
import com.kkeedsoft.kahraman_twin_api.workorder.WorkOrderNotFoundException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    ProblemDetail resourceNotFound(ResourceNotFoundException exception) {
        return problem(HttpStatus.NOT_FOUND, "Kayıt bulunamadı", exception.getMessage());
    }

    @ExceptionHandler(WorkOrderNotFoundException.class)
    ProblemDetail notFound(WorkOrderNotFoundException exception) {
        return problem(HttpStatus.NOT_FOUND, "İş emri bulunamadı", exception.getMessage());
    }

    @ExceptionHandler(InvalidWorkOrderException.class)
    ProblemDetail invalidOrder(InvalidWorkOrderException exception) {
        return problem(HttpStatus.BAD_REQUEST, "Geçersiz iş emri", exception.getMessage());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException exception,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        var body = problem(HttpStatus.BAD_REQUEST, "Geçersiz istek", "İstek alanlarını kontrol edin.");
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
                errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        body.setProperty("errors", errors);
        return handleExceptionInternal(exception, body, headers, status, request);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException exception,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        var body = problem(HttpStatus.BAD_REQUEST, "Okunamayan istek",
                "JSON gövdesini, alan türlerini ve YYYY-MM-DD tarih biçimini kontrol edin.");
        return handleExceptionInternal(exception, body, headers, status, request);
    }

    private ProblemDetail problem(HttpStatus status, String title, String detail) {
        var problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setTitle(title);
        return problem;
    }
}
