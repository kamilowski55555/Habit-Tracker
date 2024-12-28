package com.habittracker.habitprogress.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HabitProgressModifyDto {

    @Min(value = 0, message = "Current value must be at least 0.")
    private int currentValue;
}
