package com.habittracker.user.controller;

import com.habittracker.user.dto.UserRegisterDto;
import com.habittracker.user.dto.UserUpdateDto;
import com.habittracker.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> geUsersList() {
        // Zwraca listę wszystkich użytkowników (tylko admin)
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDto userDTO) {
        // Rejestruje nowego użytkownika
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserDetails(@PathVariable UUID userId) {
        // Zwraca szczegóły użytkownika (dla użytkownika lub admina)
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable UUID userId, @RequestBody UserUpdateDto updateDTO) {
        // Aktualizuje dane użytkownika (dla użytkownika lub admina)
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID userId) {
        // Usuwa konto użytkownika (dla użytkownika lub admina)
        return ResponseEntity.ok().build();
    }
}
