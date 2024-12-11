package com.habittracker.habit.dto;

import com.habittracker.habit.HabitType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.util.Set;

@Getter
@Setter
public class HabitCreateDto {
    @NotBlank(message = "Name cannot be empty.")
    @Size(max = 50, message = "Name cannot exceed 50 characters.")
    private String name;

    @NotNull(message = "Habit type must be specified.")
    private HabitType type; // GOOD or BAD

    @Min(value = 1, message = "Target value must be at least 1.")
    private int targetValue;

    @NotEmpty(message = "You must select at least one day for the habit.")
    private Set<DayOfWeek> habitDays; // Enum already validates valid days

    @NotNull(message = "Currency amount is required.")
    @Positive(message = "Currency amount must be positive")
    private Integer currencyAmount;

    @Pattern(
            regexp = "^[\\p{So}\\p{Sc}\\p{Sk}\\p{Sm}\\p{Nl}]$",
            message = "Icon must be a single emoji character."
    )
    private String icon; // Optional
}
