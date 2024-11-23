package com.habittracker.security.controller;

import com.habittracker.security.dto.LogoutDto;
import com.habittracker.security.dto.RefreshTokenDto;
import com.habittracker.security.dto.UserLoginDto;
import com.habittracker.security.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDto loginDTO) {
        // Loguje użytkownika
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenDto refreshTokenDTO) {
        // Odświeża token dostępu
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestBody LogoutDto logoutDTO) {
        // Wylogowuje użytkownika
        return ResponseEntity.ok().build();
    }
}
