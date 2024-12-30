package com.habittracker.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, UUID> {
    List<Progress> findByHabitUserIdAndDate(UUID userId, LocalDate date);

    Optional<Progress> findByIdAndHabitUserId(UUID id, UUID userId);

    Optional<Progress> findByHabitIdAndDate(UUID habitId, LocalDate date);

    void deleteAllByHabitId(UUID habitId);

    List<Progress> findByDate(LocalDate date);

    boolean existsByHabitIdAndDate(UUID id, LocalDate tomorrow);
}
