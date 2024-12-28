package com.habittracker.habitprogress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HabitProgressRepository extends JpaRepository<HabitProgress, UUID> {
    List<HabitProgress> findByHabitUserIdAndDate(UUID userId, LocalDate date);

    Optional<HabitProgress> findByIdAndHabitUserId(UUID id, UUID userId);

    Optional<HabitProgress> findByHabitIdAndDate(UUID habitId, LocalDate date);

    void deleteAllByHabitId(UUID habitId);

    List<HabitProgress> findByDate(LocalDate date);

    boolean existsByHabitIdAndDate(UUID id, LocalDate tomorrow);
}
