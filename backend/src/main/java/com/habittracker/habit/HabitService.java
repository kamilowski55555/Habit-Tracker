package com.habittracker.habit;

import com.habittracker.common.util.SecurityContextUtils;
import com.habittracker.habit.dto.HabitCreateDto;
import com.habittracker.habit.dto.HabitDetailsDto;
import com.habittracker.habit.dto.HabitListDto;
import com.habittracker.habit.dto.HabitModifyDto;
import com.habittracker.user.User;
import com.habittracker.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserService userService;

    public List<HabitListDto> getUserHabits() {

        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        // Fetch and map habits in one step
        return habitRepository.findByUserId(currentUserId)
                .stream()
                .map(habit -> HabitListDto.builder()
                        .id(habit.getId())
                        .name(habit.getName())
                        .type(habit.getType())
                        .targetValue(habit.getTargetValue())
                        .currencyAmount(habit.getCurrencyAmount())
                        .icon(habit.getIcon())
                        .build())
                .toList();
    }

    public HabitDetailsDto getHabitDetails(UUID habitId) {
        // Fetch habit from the database
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found with ID: " + habitId));

        // Validate user access
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        if (!habit.getUser().getId().equals(currentUserId)) {
            throw new SecurityException("You do not have permission to view this habit.");
        }

        return HabitDetailsDto.builder()
                .id(habit.getId())
                .userId(habit.getUser().getId())
                .name(habit.getName())
                .type(habit.getType())
                .targetValue(habit.getTargetValue())
                .habitDays(habit.getHabitDays().stream().map(Enum::name).collect(Collectors.toSet())) // Convert to String set
                .currencyAmount(habit.getCurrencyAmount())
                .icon(habit.getIcon())
                .createdAt(habit.getCreatedAt())
                .modifiedAt(habit.getModifiedAt())
                .build();
    }


    public UUID createHabit(UUID userId, HabitCreateDto habitCreateDto) {

        User user = userService.getUserById(userId);

        Habit habit = Habit.builder()
                .user(user)
                .name(habitCreateDto.getName())
                .type(habitCreateDto.getType())
                .targetValue(habitCreateDto.getTargetValue())
                .habitDays(habitCreateDto.getHabitDays())
                .currencyAmount(habitCreateDto.getCurrencyAmount())
                .icon(habitCreateDto.getIcon())
                .build();

        // Save and return ID
        return habitRepository.save(habit).getId();
    }

    public void modifyHabit(UUID habitId, HabitModifyDto habitModifyDto) {
        // Fetch the existing habit
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found with ID: " + habitId));

        // Check ownership
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        if (!habit.getUser().getId().equals(currentUserId)) {
            throw new SecurityException("You do not have permission to modify this habit.");
        }

        // Apply changes only to fields that are provided in the DTO
        if (habitModifyDto.getName() != null) {
            habit.setName(habitModifyDto.getName());
        }
        if (habitModifyDto.getType() != null) {
            habit.setType(habitModifyDto.getType());
        }
        if (habitModifyDto.getTargetValue() != null) {
            habit.setTargetValue(habitModifyDto.getTargetValue());
        }
        if (habitModifyDto.getHabitDays() != null) {
            habit.setHabitDays(habitModifyDto.getHabitDays());
        }
        if (habitModifyDto.getCurrencyAmount() != null) {
            habit.setCurrencyAmount(habitModifyDto.getCurrencyAmount());
        }
        if (habitModifyDto.getIcon() != null) {
            habit.setIcon(habitModifyDto.getIcon());
        }

        // Save the modified habit
        habitRepository.save(habit);
    }

    public void deleteHabit(UUID habitId) {
        habitRepository.deleteById(habitId);
    }
}

