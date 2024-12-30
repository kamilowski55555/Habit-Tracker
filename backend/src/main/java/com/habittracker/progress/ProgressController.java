package com.habittracker.progress;

import com.habittracker.common.util.SecurityContextUtils;
import com.habittracker.progress.dto.ProgressListDto;
import com.habittracker.progress.dto.ProgressModifyDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    // GET /api/progress?date=2024-01-02
    // Returns a list of ProgressListDto for the current user on that date
    @GetMapping
    public ResponseEntity<List<ProgressListDto>> getProgressListForDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        if (date == null) {
            date = LocalDate.now();
        }
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        List<ProgressListDto> progressListForDate = progressService.getProgressListForDate(currentUserId, date);

        return ResponseEntity.ok(progressListForDate);
    }

    // PATCH /api/progress/{id}
    // Updates the currentValue of a specific Progress
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateProgress(
            @PathVariable UUID id,
            @RequestBody @Valid ProgressModifyDto dto
    ) {
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        progressService.updateProgress(currentUserId, id, dto);
        return ResponseEntity.noContent().build();
    }
}
