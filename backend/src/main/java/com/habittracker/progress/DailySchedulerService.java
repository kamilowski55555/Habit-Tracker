package com.habittracker.progress;

import com.habittracker.habit.Habit;
import com.habittracker.habit.HabitRepository;
import com.habittracker.habit.HabitType;
import com.habittracker.user.User;
import com.habittracker.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.Logger;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
    private final JavaMailSender mailSender;
    private final Logger log;

    // Runs daily at midnight (00:00).
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void handleDailyProgress() {
        log.info("Starting daily progress task.");
        try {
            LocalDate yesterday = LocalDate.now().minusDays(1);

            // 1) Finalize yesterday
            finalizeToday(yesterday);

            // 2) Send daily report for yesterday
            sendDailyReports(yesterday);

            // 3) Initialize today's progress
            initializeTomorrow(LocalDate.now());

            // 4) Check achievements (optional)
            checkUserAchievements();

            log.info("Daily progress task completed successfully.");
        } catch (Exception ex) {
            log.error("Error while handling daily progress: ", ex);
        }
    }

    // 1) Finalize yesterday's progress
    private void finalizeToday(LocalDate yesterday) {
        List<Progress> yesterdaysEntries = progressRepository.findByDate(yesterday);

        for (Progress hp : yesterdaysEntries) {
            Habit habit = hp.getHabit();
            if (habit.getType() == HabitType.BAD) {
                // If BAD habit is kept below target => reward currency
                if (hp.getCurrentValue() < hp.getTargetValue()) {
                    User user = hp.getUser();
                    user.setCurrencyBalance(user.getCurrencyBalance() + habit.getCurrencyAmount());
                    userRepository.save(user);
                }
            }
            // If you had special logic for GOOD habits that only awards currency at day’s end,
            // you could also implement that here.
        }
    }

    // 2) Send daily report for the day
    private void sendDailyReports(LocalDate day) {
        // Get all users
        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {
            // Get all progress for that user & that day
            List<Progress> dailyProgress = progressRepository.findByHabitUserIdAndDate(user.getId(), day);
            if (dailyProgress.isEmpty()) {
                // If user had no habits on that day, skip sending a report
                continue;
            }

            // Build and send the report email
            sendDailyReportEmail(user, dailyProgress, day);
            log.info("Daily report email sent for user {} on {}", user.getEmail(), day);
        }
    }

    private void sendDailyReportEmail(User user, List<Progress> dailyProgress, LocalDate day) {
        // 1) Calculate how much currency was earned in total
        //    (We replicate the logic of “when do we add currency to user?”)
        //    For demonstration, we’ll do a simple approach:
        int totalEarnedToday = 0;
        for (Progress p : dailyProgress) {
            Habit habit = p.getHabit();
            boolean isGood = (habit.getType() == HabitType.GOOD);
            // If GOOD habit => success means (currentValue >= targetValue) => earn currency
            // If BAD habit => success means (currentValue < targetValue) => earn currency
            // We'll assume if user succeeded, they got habit.getCurrencyAmount() (for BAD)
            // or if there's separate logic for GOOD, adapt accordingly.
            if (isComplete(p, isGood)) {
                totalEarnedToday += habit.getCurrencyAmount();
            }
        }

        // 2) Build the email body, listing each habit’s daily progress
        StringBuilder sb = new StringBuilder();
        sb.append("Hello ").append(user.getFirstName() != null ? user.getFirstName() : "")
                .append(",\n\n")
                .append("Here’s your daily habit report for ")
                .append(day)
                .append(":\n\n");

        // List each habit's progress
        for (Progress p : dailyProgress) {
            Habit h = p.getHabit();
            sb.append("Habit: ").append(h.getName())
                    .append(" (").append(h.getType()).append(")\n")
                    .append("Progress: ").append(p.getCurrentValue())
                    .append("/").append(p.getTargetValue());

            // Indicate success/fail
            boolean isGood = (h.getType() == HabitType.GOOD);
            if (isComplete(p, isGood)) {
                sb.append(" ✅\n\n");
            } else {
                sb.append(" ❌\n\n");
            }
        }

        sb.append("Total currency earned today: ").append(totalEarnedToday).append("\n\n")
                .append("Keep up the good work!\n");

        // 3) Send email
        //    (We’re using SimpleMailMessage for simplicity—if you want HTML, use MimeMessageHelper)
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your Daily Habit Report - " + day);
        message.setText(sb.toString());

        mailSender.send(message);

        log.info("Daily report email prepared for user {} on {}", user.getEmail(), day);
    }

    // 3) Initialize tomorrow's progress
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

    // 4) Check achievements for all users (unchanged)
    private void checkUserAchievements() {
        // ... your existing code ...
    }

    // Determine if progress is "complete"
    // (same logic used in stats or other places)
    private boolean isComplete(Progress p, boolean isGood) {
        if (isGood) {
            // GOOD habit => success if currentValue >= targetValue
            return p.getCurrentValue() >= p.getTargetValue();
        } else {
            // BAD habit => success if currentValue < targetValue
            return p.getCurrentValue() < p.getTargetValue();
        }
    }
}