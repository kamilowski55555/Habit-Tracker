package com.habittracker.habitprogress;

import com.habittracker.habit.Habit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "habit_progress")
public class HabitProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY) // Links progress to a specific habit
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;

    @Column(nullable = false)
    private LocalDate date; // The date this progress entry is for

    @Column(name = "target_value", nullable = false)
    private int targetValue; // Daily target (e.g., 10,000 steps)

    @Column(name = "current_value", nullable = false)
    private int currentValue; // Current value achieved

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgressStatus status; // SUCCESS, FAILURE, PARTIAL

    @Column(name = "currency_earned", nullable = false)
    private int currencyEarned; // Virtual currency rewarded

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = ProgressStatus.PENDING; // Default status
        }
    }
}
