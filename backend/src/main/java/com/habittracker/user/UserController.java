package com.habittracker.user;

import com.habittracker.user.dto.UserDetailsDto;
import com.habittracker.user.dto.UserListDto;
import com.habittracker.user.dto.UserRegisterDto;
import com.habittracker.user.dto.UserUpdateDto;
import jakarta.validation.Valid;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserListDto>> geUsersList() {
        // Zwraca listę wszystkich użytkowników (tylko admin)
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerUser(@Valid @RequestBody UserRegisterDto userRegisterDto) {
        userService.registerUser(userRegisterDto);
        return ResponseEntity.status(201).build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDetailsDto> getUserDetails(@PathVariable UUID userId) {
        UserDetailsDto userDetailsDto = userService.getUserDetails(userId);
        return ResponseEntity.ok(userDetailsDto);
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<Void> updateUser(@PathVariable UUID userId, @RequestBody UserUpdateDto updateDTO) {
        // Aktualizuje dane użytkownika (dla użytkownika lub admina)
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID userId) {
        // Usuwa konto użytkownika (dla użytkownika lub admina)
        return ResponseEntity.ok().build();
    }
}
