package com.habittracker.progress.dto;

import com.habittracker.habit.HabitType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class ProgressListDto {
    private UUID id;
    private String name; // from Habit
    private LocalDate date;
    private int targetValue;
    private int currentValue;
    private HabitType type;
}
