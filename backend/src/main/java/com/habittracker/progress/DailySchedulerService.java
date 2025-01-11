package com.habittracker.progress;

import com.habittracker.habit.Habit;
import com.habittracker.habit.HabitRepository;
import com.habittracker.habit.HabitType;
import com.habittracker.user.User;
import com.habittracker.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.Logger;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class DailySchedulerService {

    private final HabitRepository habitRepository;
    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final Logger log;

    // Runs daily at midnight (00:00).
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void handleDailyProgress() {
        log.info("Starting daily progress task.");
        try {
            finalizeToday(LocalDate.now().minusDays(1));
            initializeTomorrow(LocalDate.now());

            // After finalizing and initializing, check achievements:
            checkUserAchievements();

            log.info("Daily progress task completed successfully.");
        } catch (Exception ex) {
            log.error("Error while handling daily progress: ", ex);
        }
    }

    // -------------------
    // 1) Finalize yesterday's progress
    // -------------------
    private void finalizeToday(LocalDate yesterday) {
        List<Progress> yesterdaysEntries = progressRepository.findByDate(yesterday);
        for (Progress hp : yesterdaysEntries) {
            Habit habit = hp.getHabit();
            if (habit.getType() == HabitType.BAD) {
                // Example: if currentValue < targetValue => user gains currency
                if (hp.getCurrentValue() < hp.getTargetValue()) {
                    User user = hp.getUser();
                    user.setCurrencyBalance(user.getCurrencyBalance() + habit.getCurrencyAmount());
                    userRepository.save(user);
                }
            }
        }
    }

    // -------------------
    // 2) Initialize tomorrow's progress
    // -------------------
    private void initializeTomorrow(LocalDate tomorrow) {
        DayOfWeek tomorrowDay = tomorrow.getDayOfWeek();
        List<Habit> tomorrowHabits = habitRepository.findAllByHabitDaysContaining(tomorrowDay);

        for (Habit habit : tomorrowHabits) {
            boolean exists = progressRepository.existsByHabitIdAndDate(habit.getId(), tomorrow);
            if (!exists) {
                Progress progress = Progress.builder()
                        .habit(habit)
                        .user(habit.getUser())
                        .date(tomorrow)
                        .targetValue(habit.getTargetValue())
                        .currentValue(0)
                        .build();
                progressRepository.save(progress);
            }
        }
    }

    // -------------------
    // 3) Check Achievements for All Users
    // -------------------
    private void checkUserAchievements() {
        // In reality, you might limit to "active" users, but let's keep it simple:
        List<User> allUsers = userRepository.findAll();
        LocalDateTime nowMinusAFewSeconds = LocalDateTime.now().minusSeconds(5);

        for (User user : allUsers) {
            // (A) Check if user has at least one habit => firstHabitCreated
            if (user.getAchievementFirstHabitCreatedDate() == null) {
                // If the user has at least one habit, we consider that "first habit created"
                if (user.getHabits() != null && !user.getHabits().isEmpty()) {
                    user.setAchievementFirstHabitCreatedDate(nowMinusAFewSeconds);
                }
            }

            // (B) Check if user has a 7-day streak in ANY of their habits
            if (user.getAchievementSevenDayStreakDate() == null) {
                if (hasSevenDayStreak(user)) {
                    user.setAchievementSevenDayStreakDate(nowMinusAFewSeconds);
                }
            }

            // (C) Check if user has 50 total completions across all habits
            if (user.getAchievementCompleteHabit50TimesSuccessfullyDate() == null) {
                long totalSuccesses = getUserTotalCompletions(user);
                if (totalSuccesses >= 50) {
                    user.setAchievementCompleteHabit50TimesSuccessfullyDate(nowMinusAFewSeconds);
                }
            }

            userRepository.save(user);
        }
    }

    // -------------------
    // Helper: Check 7-Day Streak
    // -------------------
    private boolean hasSevenDayStreak(User user) {
        // We'll just check each habit for a 7-day streak. If any has it, return true
        if (user.getHabits() == null) return false;

        for (Habit habit : user.getHabits()) {
            if (calculateLongestStreak(habit) >= 7) {
                return true;
            }
        }
        return false;
    }

    // Reuse logic from your existing "longest streak" approach:
    private long calculateLongestStreak(Habit habit) {
        boolean isGood = habit.getType() == HabitType.GOOD;
        List<Progress> progresses = progressRepository.findByHabitIdOrderByDateAsc(habit.getId());

        long longestStreak = 0;
        long tempStreak = 0;
        LocalDate prevDate = null;

        for (Progress p : progresses) {
            if (!isComplete(p, isGood)) {
                tempStreak = 0;
            } else {
                if (prevDate != null && p.getDate().equals(prevDate.plusDays(1))) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }
                longestStreak = Math.max(longestStreak, tempStreak);
            }
            prevDate = p.getDate();
        }
        return longestStreak;
    }

    // -------------------
    // Helper: Check 50 total completions across ALL user's habits
    // -------------------
    private long getUserTotalCompletions(User user) {
        if (user.getHabits() == null) return 0L;

        long totalSuccesses = 0;
        for (Habit habit : user.getHabits()) {
            boolean isGood = (habit.getType() == HabitType.GOOD);
            List<Progress> progresses = progressRepository.findByHabitIdOrderByDateAsc(habit.getId());
            totalSuccesses += progresses.stream()
                    .filter(p -> isComplete(p, isGood))
                    .count();
        }
        return totalSuccesses;
    }

    private boolean isComplete(Progress p, boolean isGood) {
        if (isGood) {
            return p.getCurrentValue() >= p.getTargetValue();
        } else {
            return p.getCurrentValue() < p.getTargetValue();
        }
    }
}


