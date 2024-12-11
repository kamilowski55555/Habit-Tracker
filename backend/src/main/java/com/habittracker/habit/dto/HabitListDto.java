package com.habittracker.habit.dto;

import com.habittracker.habit.HabitType;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class HabitListDto {
    private UUID id;
    private String name; // Habit name
    private HabitType type; // GOOD or BAD
    private int targetValue; // Target value for the habit
    private int currencyAmount; // Currency reward/penalty
    private String icon; // Emoji or icon for the habit
}
