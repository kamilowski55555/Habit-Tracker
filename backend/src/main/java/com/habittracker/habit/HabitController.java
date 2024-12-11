package com.habittracker.habit;

import com.habittracker.common.util.SecurityContextUtils;
import com.habittracker.habit.dto.HabitCreateDto;
import com.habittracker.habit.dto.HabitDetailsDto;
import com.habittracker.habit.dto.HabitListDto;
import com.habittracker.habit.dto.HabitModifyDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @GetMapping
    public ResponseEntity<List<HabitListDto>> getUserHabits() {
        // Fetch habits for the authenticated user
        List<HabitListDto> habits = habitService.getUserHabits();

        // Return the list of habits
        return ResponseEntity.ok(habits);
    }

    @GetMapping("/{habitId}")
    public ResponseEntity<HabitDetailsDto> getHabitDetails(@PathVariable UUID habitId) {
        // Fetch habit details using the service
        HabitDetailsDto habitDetails = habitService.getHabitDetails(habitId);

        // Return the details in the response
        return ResponseEntity.ok(habitDetails);
    }

    @PostMapping
    public ResponseEntity<Void> createHabitForCurrentUser(
            @Valid @RequestBody HabitCreateDto habitCreateDto) {

        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        UUID habitId = habitService.createHabit(currentUserId, habitCreateDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(habitId)
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')") // Ensure only admins can access this endpoint
    public ResponseEntity<Void> createHabitForAnotherUser(
            @PathVariable UUID userId,
            @Valid @RequestBody HabitCreateDto habitCreateDto) {

        UUID habitId = habitService.createHabit(userId, habitCreateDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(habitId)
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PatchMapping("/{habitId}")
    public ResponseEntity<Void> modifyHabit(
            @PathVariable UUID habitId,
            @Valid @RequestBody HabitModifyDto habitModifyDto) {
        // Call the service to modify the habit
        habitService.modifyHabit(habitId, habitModifyDto);

        // Return 204 No Content if successful
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{habitId}")
    public ResponseEntity<Void> deleteHabit(@PathVariable UUID habitId) {
        habitService.deleteHabit(habitId);
        return ResponseEntity.noContent().build();
    }
}

