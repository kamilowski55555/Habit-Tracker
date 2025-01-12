package com.habittracker.user;

import com.habittracker.habit.HabitType;
import com.habittracker.progress.Progress;
import com.habittracker.progress.ProgressRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.Logger;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class NotificationSchedulerService {

    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;
    private final JavaMailSender mailSender;
    private final Logger log;

    // This runs every minute
    // Cron "0 * * * * *" means: second=0, every minute, every hour, every day, etc.
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void checkNotifications() {
        // Truncate seconds and nanos to match times stored in the DB
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);

        // 1. Get all users who have notifications enabled
        List<User> users = userRepository.findAllByNotificationsEnabledTrue();

        // 2. For each user, check if now is in their notificationTimes
        for (User user : users) {
            if (user.getNotificationTimes().contains(now)) {
                // 3. Find incomplete progress for "today" (LocalDate.now())
                List<Progress> incompleteProgresses = findIncompleteProgressForUserToday(user.getId());

                if (!incompleteProgresses.isEmpty()) {
                    // 4. Send an email
                    sendNotificationEmail(user, incompleteProgresses);
                    log.info("Sent notification email to user: " + user.getEmail());
                }
            }
        }
    }

    // Example method that returns the user's incomplete progress for "today"
    private List<Progress> findIncompleteProgressForUserToday(UUID userId) {
        LocalDate today = LocalDate.now();

        // Get all progress entries for user for today's date
        List<Progress> progressList = progressRepository.findByHabitUserIdAndDate(userId, today);

        // Filter out the “completed” ones
        // GOOD habit => completed if currentValue >= targetValue
        // BAD habit => completed if currentValue < targetValue
        return progressList.stream()
                .filter(p -> {
                    boolean isGood = (p.getHabit().getType() == HabitType.GOOD);
                    int curr = p.getCurrentValue();
                    int target = p.getTargetValue();

                    if (isGood) {
                        return curr < target;  // incomplete if curr < target
                    } else {
                        return curr >= target; // incomplete if curr >= target (BAD means user went over limit)
                    }
                })
                .toList();
    }

    private void sendNotificationEmail(User user, List<Progress> incomplete) {
        // Separate incomplete Good vs. Bad habits
        List<Progress> incompleteGood = incomplete.stream()
                .filter(p -> p.getHabit().getType() == HabitType.GOOD)
                .toList();

        List<Progress> incompleteBad = incomplete.stream()
                .filter(p -> p.getHabit().getType() == HabitType.BAD)
                .toList();

        // Build a more descriptive message
        StringBuilder sb = new StringBuilder();
        sb.append("Hello ").append(user.getFirstName()).append(",\n\n");

        // Good habits incomplete
        if (!incompleteGood.isEmpty()) {
            sb.append("You still haven't completed building your future self!:\n");
            for (Progress p : incompleteGood) {
                sb.append(" - ").append(p.getHabit().getName()).append("\n");
            }
            sb.append("\n");
        }

        // Bad habits not kept in check
        if (!incompleteBad.isEmpty()) {
            sb.append("You're doing great by keeping these away:\n");
            for (Progress p : incompleteBad) {
                sb.append(" - ").append(p.getHabit().getName()).append("\n");
            }
            sb.append("\n");
        }

        // If neither list is empty, or you want some closing line
        sb.append("Keep going—you've got this!\n");

        // Prepare and send the email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Habit Reminder");
        message.setText(sb.toString());
        mailSender.send(message);
    }
}

