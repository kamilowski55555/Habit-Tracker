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
        // Build a simple message
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Habit Reminder");

        String body = "You still have incomplete habits today:\n";
        for (Progress p : incomplete) {
            body += "- " + p.getHabit().getName() + "\n";
        }

        message.setText(body);
        mailSender.send(message);
    }
}

