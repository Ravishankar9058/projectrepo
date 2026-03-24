package com.luv2code.oled.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    /**
     * GET /auth/login
     * Spring Security validates the Basic Auth credentials automatically.
     * Returns 200 + user info on success, 401 on bad credentials.
     */
    @GetMapping("/login")
    public ResponseEntity<?> login(Authentication authentication) {
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", "").toLowerCase())
                .orElse("user");

        return ResponseEntity.ok(Map.of(
                "username", username,
                "role", role
        ));
    }
}
