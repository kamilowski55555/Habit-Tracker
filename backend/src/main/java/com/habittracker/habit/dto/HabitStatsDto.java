package com.habittracker.habit.dto;

import com.habittracker.habit.HabitType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class HabitStatsDto {
    private String name;
    private HabitType type;
    private LocalDate creationDate;

    private long totalCompletions;       // e.g. total successful days
    private long completionsThisMonth;   // how many times user has completed the habit this month

    private long currentStreak;          // consecutive successful days up to now
    private long longestStreak;          // max consecutive successful days in entire history

    private long projectedDaysThisMonth; // how many times the habit is scheduled this month
    private long completedDaysThisMonth; // how many of those were actually completed
}
