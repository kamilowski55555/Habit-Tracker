package com.habittracker.habitprogress.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class HabitProgressListDto {
    private UUID id;
    private String name; // from Habit
    private LocalDate date;
    private int targetValue;
    private int currentValue;
}
