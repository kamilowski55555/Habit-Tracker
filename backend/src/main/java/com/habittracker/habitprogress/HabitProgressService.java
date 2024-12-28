package com.habittracker.habitprogress;

import com.habittracker.habit.Habit;
import com.habittracker.habit.HabitType;
import com.habittracker.habitprogress.dto.HabitProgressListDto;
import com.habittracker.habitprogress.dto.HabitProgressModifyDto;
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
public class HabitProgressService {

    private final HabitProgressRepository habitProgressRepository;
    private final UserRepository userRepository;

    public List<HabitProgressListDto> getProgressListForDate(UUID currentUserId, LocalDate date) {
        return habitProgressRepository.findByHabitUserIdAndDate(currentUserId, date)
                .stream()
                .map(habitProgress -> HabitProgressListDto.builder()
                        .id(habitProgress.getId())
                        .name(habitProgress.getHabit().getName())
                        .date(habitProgress.getDate())
                        .targetValue(habitProgress.getTargetValue())
                        .currentValue(habitProgress.getCurrentValue())
                        .build())
                .toList();
    }

    @Transactional
    public void updateProgress(UUID userId, UUID progressId, HabitProgressModifyDto dto) {
        // Fetch record ensuring it belongs to this user
        HabitProgress habitProgress = habitProgressRepository
                .findByIdAndHabitUserId(progressId, userId)
                .orElseThrow(() -> new RuntimeException("Not found or not yours"));

        int oldValue = habitProgress.getCurrentValue();
        int targetValue = habitProgress.getTargetValue();
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
        if (habitProgress.getHabit().getType() == HabitType.GOOD) {
            adjustCurrency(habitProgress, oldValue, newValue);
            userRepository.save(habitProgress.getUser()); // Save updated user balance
        }

        habitProgress.setCurrentValue(newValue);
        habitProgressRepository.save(habitProgress);
    }

    private void adjustCurrency(HabitProgress progress, int oldValue, int newValue) {
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
