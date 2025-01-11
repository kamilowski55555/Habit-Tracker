package com.habittracker.reward.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class RewardListDto {
    private UUID id;
    private String name;
    private int cost;
    private String emoji;
}
