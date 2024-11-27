package com.habittracker.security;

import com.habittracker.common.exception.InvalidCredentialsException;
import com.habittracker.common.exception.UserNotFoundException;
import com.habittracker.security.dto.LoginRequest;
import com.habittracker.user.User;
import com.habittracker.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String login(LoginRequest loginDto) {

        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        // Generate a new tokenVersion
        UUID newTokenVersion = UUID.randomUUID();
        user.setTokenVersion(newTokenVersion);
        userRepository.save(user);

        return jwtUtil.generateAccessToken(user.getId(), user.getRole().name(), newTokenVersion);
    }

    public void logout() {
        // Extract the authenticated user from the SecurityContext
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UUID userId)) {
            throw new InvalidCredentialsException("User not authenticated");
        }

        // Update tokenVersion for the authenticated user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Token invalid"));

        user.setTokenVersion(UUID.randomUUID()); // Generate new tokenVersion
        userRepository.save(user);
    }
}
