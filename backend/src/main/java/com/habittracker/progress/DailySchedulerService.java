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
import java.util.List;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class DailySchedulerService {

    private final HabitRepository habitRepository;
    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final Logger log;

    // Runs daily at midnight (00:00). Adjust cron if you want 23:59 or another time.
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void handleDailyProgress() {
        log.info("Starting daily progress task.");
        try {
            finalizeToday(LocalDate.now().minusDays(1));
            initializeTomorrow(LocalDate.now());
            log.info("Daily progress task completed successfully.");
        } catch (Exception ex) {
            log.error("Error while handling daily progress: ", ex);
        }
    }

    private void finalizeToday(LocalDate yesterday) {
        List<Progress> yesterdaysEntries =
                progressRepository.findByDate(yesterday);
        // Do something if needed: awarding currency, marking status, etc.

        for (Progress hp : yesterdaysEntries) {
            Habit habit = hp.getHabit();
            if (habit.getType() == HabitType.BAD) {
                // Example rule: if currentValue < targetValue => user gains currency
                if (hp.getCurrentValue() < hp.getTargetValue()) {
                    User user = hp.getUser();
                    user.setCurrencyBalance(user.getCurrencyBalance() + habit.getCurrencyAmount());
                    userRepository.save(user);
                }
            }
        }
    }

    private void initializeTomorrow(LocalDate tomorrow) {
        // Find all habits matching tomorrow’s DayOfWeek
        DayOfWeek tomorrowDay = tomorrow.getDayOfWeek();
        List<Habit> tomorrowHabits = habitRepository.findAllByHabitDaysContaining(tomorrowDay);

        // For each, if no progress record for tomorrow, create one
        for (Habit habit : tomorrowHabits) {
            boolean exists = progressRepository
                    .existsByHabitIdAndDate(habit.getId(), tomorrow);
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
}

