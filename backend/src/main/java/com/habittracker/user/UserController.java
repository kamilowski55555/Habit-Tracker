package com.habittracker.user;

import com.habittracker.common.util.SecurityContextUtils;
import com.habittracker.user.dto.NotificationEnableRequest;
import com.habittracker.user.dto.NotificationTimeRequest;
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
    public ResponseEntity<List<UserListDto>> getUsersList() {
        return ResponseEntity.status(501).build();
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
        userService.updateUser(userId, updateDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
        return ResponseEntity.status(501).build();
    }

    @PostMapping("/{userId}/notifications")
    public ResponseEntity<Void> addNotificationTime(@PathVariable UUID userId,@RequestBody NotificationTimeRequest request) {
        userService.addNotificationTime(userId, request.getTime());
        return ResponseEntity.noContent().build();  // 204 for "update"
    }

    @DeleteMapping("/{userId}/notifications")
    public ResponseEntity<Void> removeNotificationTime(@PathVariable UUID userId, @RequestBody NotificationTimeRequest request) {
        userService.removeNotificationTime(userId, request.getTime());
        return ResponseEntity.ok().build(); // 200 OK
    }

    @PatchMapping("/{userId}/notifications")
    public ResponseEntity<Void> updateNotificationsEnabled(@PathVariable UUID userId, @RequestBody NotificationEnableRequest request) {
        userService.updateNotificationsEnabled(userId, request);
        return ResponseEntity.noContent().build();
    }
}
