package com.habittracker.security;

import com.habittracker.security.dto.LoginRequest;
import com.habittracker.security.dto.LogoutResponse;
import com.habittracker.security.dto.TokenResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginDto) {

        String accessToken = authService.login(loginDto);

        return ResponseEntity.ok(TokenResponse.builder()
                .accessToken(accessToken)
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout() {

        authService.logout();

        return ResponseEntity.ok(LogoutResponse.builder()
                .message("User logged out successfully")
                .build());
    }


}

