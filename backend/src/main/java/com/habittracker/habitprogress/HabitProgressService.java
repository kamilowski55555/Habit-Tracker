//package com.habittracker.habitprogress;
//
//import com.habittracker.habit.Habit;
//import com.habittracker.habit.HabitRepository;
//import com.habittracker.habit.HabitType;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class HabitProgressService {
//
//    private final HabitProgressRepository habitProgressRepository;
//    private final HabitRepository habitRepository;
//
//    public List<HabitProgress> getProgressByHabit(UUID habitId) {
//        return habitProgressRepository.findByHabitId(habitId);
//    }
//
//    public HabitProgress getProgressForToday(UUID habitId) {
//        LocalDate today = LocalDate.now();
//        return habitProgressRepository.findByHabitIdAndDate(habitId, today);
//    }
//
//    public HabitProgress logProgress(UUID habitId, int incrementValue) {
//        Habit habit = habitRepository.findById(habitId)
//                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
//
//        LocalDate today = LocalDate.now();
//        HabitProgress progress = habitProgressRepository.findByHabitIdAndDate(habitId, today);
//
//        // Create a new progress entry if one doesn't exist for today
//        if (progress == null) {
//            progress = HabitProgress.builder()
//                    .habit(habit)
//                    .date(today)
//                    .targetValue(habit.getTargetValue()) // Use the target value from the habit
//                    .currentValue(0) // Start with zero progress
//                    .status(ProgressStatus.PENDING) // Default status
//                    .currencyEarned(0)
//                    .build();
//        }
//
//        // Update progress
//        progress.setCurrentValue(progress.getCurrentValue() + incrementValue);
//
//        // Evaluate status based on habit type
//        if (habit.getType() == HabitType.GOOD) {
//            if (progress.getCurrentValue() >= progress.getTargetValue()) {
//                progress.setStatus(ProgressStatus.SUCCESS);
//                progress.setCurrencyEarned(habit.getRewardAmount());
//            } else {
//                progress.setStatus(ProgressStatus.PENDING); // Not yet a failure
//            }
//        } else if (habit.getType() == HabitType.BAD) {
//            if (progress.getCurrentValue() < progress.getTargetValue()) {
//                progress.setStatus(ProgressStatus.SUCCESS);
//                progress.setCurrencyEarned(habit.getRewardAmount());
//            } else {
//                progress.setStatus(ProgressStatus.FAILURE);
//            }
//        }
//
//        return habitProgressRepository.save(progress);
//    }
//}
