package com.habittracker.reward.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RewardCreateDto {
    @NotBlank(message = "Name cannot be empty.")
    @Size(max = 50, message = "Name cannot exceed 50 characters.")
    private String name;
    @Min(value = 1, message = "Cost must be greater than 0.")
    private int cost;
}
