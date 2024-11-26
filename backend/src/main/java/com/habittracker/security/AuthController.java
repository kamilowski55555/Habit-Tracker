package com.habittracker.security;

import com.habittracker.common.exception.InvalidCredentialsException;
import com.habittracker.common.exception.UserNotFoundException;
import com.habittracker.security.dto.TokenResponse;
import com.habittracker.security.dto.LoginRequest;
import com.habittracker.security.dto.LogoutResponse;
import com.habittracker.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginDto) {
        var user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        // Generate a new tokenVersion
        UUID newTokenVersion = UUID.randomUUID();
        user.setTokenVersion(newTokenVersion);
        userRepository.save(user);

        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole().name(), newTokenVersion);

        return ResponseEntity.ok(TokenResponse.builder()
                .accessToken(accessToken)
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Extract the authenticated user from the SecurityContext
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UUID userId)) {
            throw new InvalidCredentialsException("User not authenticated");
        }

        // Update tokenVersion for the authenticated user
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Token invalid"));

        user.setTokenVersion(UUID.randomUUID()); // Generate new tokenVersion
        userRepository.save(user);

        return ResponseEntity.ok(LogoutResponse.builder()
                .message("User logged out successfully")
                .build());
    }


}

