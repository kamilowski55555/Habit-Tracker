package com.habittracker.habitprogress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface HabitProgressRepository extends JpaRepository<HabitProgress, UUID> {
    List<HabitProgress> findByHabitId(UUID habitId); // Find progress for a specific habit

    HabitProgress findByHabitIdAndDate(UUID habitId, LocalDate date); // Find today's progress
}
