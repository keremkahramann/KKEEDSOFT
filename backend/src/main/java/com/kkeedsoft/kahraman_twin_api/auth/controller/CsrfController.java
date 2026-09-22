package com.kkeedsoft.kahraman_twin_api.auth.controller;

import org.springframework.context.annotation.Profile;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("local")
public class CsrfController {
    @GetMapping({"/api/v1/auth/csrf", "/api/csrf"})
    public CsrfResponse csrf(CsrfToken token) {
        return new CsrfResponse(token.getHeaderName(), token.getToken());
    }

    public record CsrfResponse(String headerName, String token) { }
}
