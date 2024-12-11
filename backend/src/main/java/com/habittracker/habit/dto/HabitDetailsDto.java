package com.habittracker.habit.dto;

import com.habittracker.habit.HabitType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
public class HabitDetailsDto {
    private UUID id;
    private UUID userId;
    private String name;
    private HabitType type; // GOOD or BAD
    private int targetValue;
    private Set<String> habitDays; // e.g., ["MONDAY", "WEDNESDAY"]
    private int currencyAmount;
    private String icon; // Optional
    private UUID createdBy;
    private UUID updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
