package com.habittracker.habit.dto;

import com.habittracker.habit.HabitType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.util.Set;

@Getter
@Setter
public class HabitModifyDto {
    @Size(max = 50, message = "Name cannot exceed 50 characters.")
    private String name; // Optional

    private HabitType type; // Optional: GOOD or BAD

    @Min(value = 1, message = "Target value must be at least 1.")
    private Integer targetValue; // Optional

    private Set<DayOfWeek> habitDays; // Optional

    @Positive(message = "Currency amount must be positive")
    private Integer currencyAmount; // Optional

    @Pattern(
            regexp = "^[\\p{So}\\p{Sc}\\p{Sk}\\p{Sm}\\p{Nl}]$",
            message = "Icon must be a single emoji character."
    )
    private String icon; // Optional
}
