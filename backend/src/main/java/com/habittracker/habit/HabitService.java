package com.habittracker.habit;

import com.habittracker.common.exception.ResourceAccessDeniedException;
import com.habittracker.common.util.SecurityContextUtils;
import com.habittracker.habit.dto.HabitCreateDto;
import com.habittracker.habit.dto.HabitDetailsDto;
import com.habittracker.habit.dto.HabitListDto;
import com.habittracker.habit.dto.HabitModifyDto;
import com.habittracker.habit.dto.HabitStatsDto;
import com.habittracker.progress.Progress;
import com.habittracker.progress.ProgressRepository;
import com.habittracker.user.User;
import com.habittracker.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserService userService;
    private final ProgressRepository progressRepository;

    public List<HabitListDto> getUserHabits() {

        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        // Fetch and map habits in one step
        return habitRepository.findByUserId(currentUserId)
                .stream()
                .map(habit -> HabitListDto.builder()
                        .id(habit.getId())
                        .name(habit.getName())
                        .type(habit.getType())
                        .targetValue(habit.getTargetValue())
                        .habitDays(habit.getHabitDays())
                        .currencyAmount(habit.getCurrencyAmount())
                        .icon(habit.getIcon())
                        .build())
                .toList();
    }

    public HabitDetailsDto getHabitDetails(UUID habitId) {
        // Fetch habit from the database
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found with ID: " + habitId));

        // Validate user access
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        if (!habit.getUser().getId().equals(currentUserId)) {
            throw new ResourceAccessDeniedException("You do not have permission to access this resource.");
        }

        return HabitDetailsDto.builder()
                .id(habit.getId())
                .userId(habit.getUser().getId())
                .name(habit.getName())
                .type(habit.getType())
                .targetValue(habit.getTargetValue())
                .habitDays(habit.getHabitDays().stream().map(Enum::name).collect(Collectors.toSet())) // Convert to String set
                .currencyAmount(habit.getCurrencyAmount())
                .icon(habit.getIcon())
                .createdAt(habit.getCreatedAt())
                .modifiedAt(habit.getModifiedAt())
                .build();
    }

    @Transactional
    public UUID createHabit(UUID userId, HabitCreateDto habitCreateDto) {

        User user = userService.getUserById(userId);

        Habit habit = Habit.builder()
                .user(user)
                .name(habitCreateDto.getName())
                .type(habitCreateDto.getType())
                .targetValue(habitCreateDto.getTargetValue())
                .habitDays(habitCreateDto.getHabitDays())
                .currencyAmount(habitCreateDto.getCurrencyAmount())
                .icon(habitCreateDto.getIcon())
                .build();
        // If today’s day of week matches the newly created habit’s schedule, create a Progress record
        if (habit.getHabitDays().contains(LocalDate.now().getDayOfWeek())) {
            Progress progress = Progress.builder()
                    .habit(habit)
                    .user(user)
                    .date(LocalDate.now())
                    .targetValue(habit.getTargetValue())
                    .currentValue(0)
                    .build();
            progressRepository.save(progress);
        }
        // Save and return ID
        return habitRepository.save(habit).getId();
    }

    @Transactional
    public void modifyHabit(UUID habitId, HabitModifyDto habitModifyDto) {
        // Fetch the existing habit
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found with ID: " + habitId));

        // Check ownership
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        if (!habit.getUser().getId().equals(currentUserId)) {
            throw new ResourceAccessDeniedException("You do not have permission to access this resource.");
        }

        boolean targetChanged = false;
        // Apply changes only to fields that are provided in the DTO
        if (habitModifyDto.getName() != null) {
            habit.setName(habitModifyDto.getName());
        }
        if (habitModifyDto.getType() != null) {
            habit.setType(habitModifyDto.getType());
        }
        if (habitModifyDto.getTargetValue() != null) {
            targetChanged = true;
            habit.setTargetValue(habitModifyDto.getTargetValue());
        }
        if (habitModifyDto.getHabitDays() != null) {
            habit.setHabitDays(habitModifyDto.getHabitDays());
        }
        if (habitModifyDto.getCurrencyAmount() != null) {
            habit.setCurrencyAmount(habitModifyDto.getCurrencyAmount());
        }
        if (habitModifyDto.getIcon() != null) {
            habit.setIcon(habitModifyDto.getIcon());
        }

        if (habit.getHabitDays().contains(LocalDate.now().getDayOfWeek()) && targetChanged) {
            Optional<Progress> maybeProgress = progressRepository
                    .findByHabitIdAndDate(habit.getId(), LocalDate.now());
            if (maybeProgress.isPresent()) {
                Progress progress = maybeProgress.get();
                progress.setTargetValue(habit.getTargetValue());
                progress.setCurrentValue(0);
                progressRepository.save(progress);
            } else {
                Progress progress = Progress.builder()
                        .habit(habit)
                        .user(habit.getUser())
                        .date(LocalDate.now())
                        .targetValue(habit.getTargetValue())
                        .currentValue(0)
                        .build();
                progressRepository.save(progress);
            }
        }

        // Save the modified habit
        habitRepository.save(habit);
    }

    @Transactional
    public void deleteHabit(UUID habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found with ID: " + habitId));

        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        if (!habit.getUser().getId().equals(currentUserId)) {
            throw new ResourceAccessDeniedException("You do not have permission to access this resource.");
        }
        progressRepository.deleteAllByHabitId(habitId);
        habitRepository.deleteById(habitId);
    }

    @Transactional()
    public HabitStatsDto getHabitStats(UUID habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found with ID: " + habitId));

        // Security check
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        if (!habit.getUser().getId().equals(currentUserId)) {
            throw new ResourceAccessDeniedException("Not your habit!");
        }

        // 1. Get all progress records for this habit
        List<Progress> allProgresses = progressRepository.findByHabitIdOrderByDateAsc(habitId);

        // 2. Determine how to check "success" based on habit type
        boolean isGood = habit.getType() == HabitType.GOOD;

        // 3. Calculate totalCompletions
        long totalCompletions = allProgresses.stream()
                .filter(p -> isComplete(p, isGood))  // see helper method below
                .count();

        // 4. Calculate completionsThisMonth
        YearMonth currentYM = YearMonth.now();
        long completionsThisMonth = allProgresses.stream()
                .filter(p -> isComplete(p, isGood))
                .filter(p -> YearMonth.from(p.getDate()).equals(currentYM))
                .count();

        // 5. Calculate currentStreak & longestStreak
        //    We'll iterate over sorted progress, track consecutive success days.
        long currentStreak;
        long longestStreak = 0;

        long tempStreak = 0;
        LocalDate previousDate = null;

        for (Progress p : allProgresses) {
            if (!isComplete(p, isGood)) {
                tempStreak = 0; // reset on failure
            } else {
                // Check if it's consecutive with previous day
                if (previousDate != null && p.getDate().equals(previousDate.plusDays(1))) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }
                longestStreak = Math.max(longestStreak, tempStreak);
            }
            previousDate = p.getDate();
        }
        // if the last day was successful, that's your currentStreak
        currentStreak = tempStreak;

        // 6. Calculate projectedDaysThisMonth
        //    Count how many days in the current month match the habitDays
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        long projectedDaysThisMonth = 0;
        long completedDaysThisMonth = 0;

        for (LocalDate d = startOfMonth; !d.isAfter(endOfMonth); d = d.plusDays(1)) {
            if (habit.getHabitDays().contains(d.getDayOfWeek())) {
                projectedDaysThisMonth++;

                // Check if there's a 'success' for that day
                LocalDate finalD = d;
                Optional<Progress> maybeProgress = allProgresses.stream()
                        .filter(p -> p.getDate().equals(finalD))
                        .findFirst();
                if (maybeProgress.isPresent() && isComplete(maybeProgress.get(), isGood)) {
                    completedDaysThisMonth++;
                }
            }
        }

        // 7. Build and return the stats DTO
        return HabitStatsDto.builder()
                .name(habit.getName())
                .type(habit.getType())
                .creationDate(habit.getCreatedAt() != null ? habit.getCreatedAt().toLocalDate() : null)
                .totalCompletions(totalCompletions)
                .completionsThisMonth(completionsThisMonth)
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .projectedDaysThisMonth(projectedDaysThisMonth)
                .completedDaysThisMonth(completedDaysThisMonth)
                .build();
    }

    private boolean isComplete(Progress p, boolean isGoodHabit) {
        if (isGoodHabit) {
            return p.getCurrentValue() >= p.getTargetValue();
        } else {
            return p.getCurrentValue() < p.getTargetValue();
        }
    }
}

