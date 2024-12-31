package com.habittracker.reward.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class RewardDetailsDto {
    private UUID id;
    private String name;
    private int cost;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
