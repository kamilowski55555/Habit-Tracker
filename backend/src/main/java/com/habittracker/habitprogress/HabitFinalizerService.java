package com.habittracker.habitprogress;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HabitFinalizerService {

    private final HabitProgressRepository habitProgressRepository;

//    @Scheduled(cron = "0 0 0 * * ?") // Runs every day at midnight
//    public void finalizeDay() {
//        LocalDate yesterday = LocalDate.now().minusDays(1);
//
//        List<HabitProgress> pendingProgress = habitProgressRepository.findByDate(yesterday);
//        for (HabitProgress progress : pendingProgress) {
//            if (progress.getStatus() == ProgressStatus.PENDING) {
//                if (progress.getHabit().getType() == HabitType.GOOD) {
//                    progress.setStatus(ProgressStatus.FAILURE);
//                } else if (progress.getHabit().getType() == HabitType.BAD) {
//                    progress.setStatus(
//                            progress.getCurrentValue() < progress.getTargetValue() ?
//                                    ProgressStatus.SUCCESS :
//                                    ProgressStatus.FAILURE
//                    );
//                }
//                habitProgressRepository.save(progress);
//            }
//        }
//    }
}

