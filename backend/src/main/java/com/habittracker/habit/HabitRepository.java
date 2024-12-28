package com.habittracker.habit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

public interface HabitRepository extends JpaRepository<Habit, UUID> {
    List<Habit> findByUserId(UUID userId); // Find habits for a specific user

    List<Habit> findAllByHabitDaysContaining(DayOfWeek day);
}

