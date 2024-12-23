//package com.habittracker.habitprogress;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/progress")
//@RequiredArgsConstructor
//public class HabitProgressController {
//
//    private final HabitProgressService habitProgressService;
//
//    @GetMapping("/{habitId}")
//    public ResponseEntity<List<HabitProgress>> getProgressByHabit(@PathVariable UUID habitId) {
//        return ResponseEntity.ok(habitProgressService.getProgressByHabit(habitId));
//    }
//
//    @PostMapping("/{habitId}")
//    public ResponseEntity<HabitProgress> logProgress(@PathVariable UUID habitId, @RequestParam int incrementValue) {
//        return ResponseEntity.ok(habitProgressService.logProgress(habitId, incrementValue));
//    }
//}
