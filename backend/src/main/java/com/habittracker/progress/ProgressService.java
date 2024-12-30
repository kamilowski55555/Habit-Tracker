package com.habittracker.progress;

import com.habittracker.habit.Habit;
import com.habittracker.habit.HabitType;
import com.habittracker.progress.dto.ProgressListDto;
import com.habittracker.progress.dto.ProgressModifyDto;
import com.habittracker.user.User;
import com.habittracker.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    public List<ProgressListDto> getProgressListForDate(UUID currentUserId, LocalDate date) {
        return progressRepository.findByHabitUserIdAndDate(currentUserId, date)
                .stream()
                .map(habitProgress -> ProgressListDto.builder()
                        .id(habitProgress.getId())
                        .name(habitProgress.getHabit().getName())
                        .date(habitProgress.getDate())
                        .targetValue(habitProgress.getTargetValue())
                        .currentValue(habitProgress.getCurrentValue())
                        .habitType(habitProgress.getHabit().getType())
                        .build())
                .toList();
    }

    @Transactional
    public void updateProgress(UUID userId, UUID progressId, ProgressModifyDto dto) {
        // Fetch record ensuring it belongs to this user
        Progress progress = progressRepository
                .findByIdAndHabitUserId(progressId, userId)
                .orElseThrow(() -> new RuntimeException("Not found or not yours"));

        int oldValue = progress.getCurrentValue();
        int targetValue = progress.getTargetValue();
        int newValue = dto.getCurrentValue();

        // Guard clause if no change
        if (newValue == oldValue) {
            return;
        }

        // Guard clause if exceeding target
        if (newValue > targetValue) {
            throw new RuntimeException("Current value exceeds target");
        }

        // If it's a GOOD habit, adjust the user's currency if needed
        if (progress.getHabit().getType() == HabitType.GOOD) {
            adjustCurrency(progress, oldValue, newValue);
            userRepository.save(progress.getUser()); // Save updated user balance
        }

        progress.setCurrentValue(newValue);
        progressRepository.save(progress);
    }

    private void adjustCurrency(Progress progress, int oldValue, int newValue) {
        User user = progress.getUser();
        Habit habit = progress.getHabit();
        int target = progress.getTargetValue();

        boolean wasComplete = (oldValue == target);
        boolean isComplete = (newValue == target);

        if (wasComplete && !isComplete) {
            user.setCurrencyBalance(user.getCurrencyBalance() - habit.getCurrencyAmount());
        } else if (!wasComplete && isComplete) {
            user.setCurrencyBalance(user.getCurrencyBalance() + habit.getCurrencyAmount());
        }
    }

}
