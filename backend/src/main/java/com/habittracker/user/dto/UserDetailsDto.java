package com.habittracker.user.dto;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
public class UserDetailsDto {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String goal;
    private String role;
    private LocalDateTime achievementFirstHabitCreatedDate;
    private LocalDateTime achievementSevenDayStreakDate;
    private LocalDateTime achievementCompleteHabit50TimesSuccessfullyDate;
    private long currencyBalance;
    private boolean notificationsEnabled;
    private Set<LocalTime> notificationTimes;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
