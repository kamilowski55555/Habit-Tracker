package com.habittracker.reward;

import com.habittracker.reward.dto.RewardCreateDto;
import com.habittracker.reward.dto.RewardDetailsDto;
import com.habittracker.reward.dto.RewardListDto;
import com.habittracker.reward.dto.RewardModifyDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<List<RewardListDto>> getRewards() {
        List<RewardListDto> rewards = rewardService.getUserRewards();
        return ResponseEntity.ok(rewards);
    }

    @PostMapping
    public ResponseEntity<Void> createReward(
            @Valid @RequestBody RewardCreateDto rewardCreateDto) {

        UUID habitId = rewardService.createReward(rewardCreateDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(habitId)
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @GetMapping("/{rewardId}")
    public ResponseEntity<RewardDetailsDto> getHabitDetails(@PathVariable UUID rewardId) {
        // Fetch habit details using the service
        RewardDetailsDto rewardDetails = rewardService.getRewardDetails(rewardId);

        // Return the details in the response
        return ResponseEntity.ok(rewardDetails);
    }

    @PatchMapping("/{rewardId}")
    public ResponseEntity<Void> modifyReward(
            @PathVariable UUID rewardId,
            @Valid @RequestBody RewardModifyDto rewardModifyDto) {

        UUID habitId = rewardService.modifyReward(rewardId, rewardModifyDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(habitId)
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @DeleteMapping("/{rewardId}")
    public ResponseEntity<Void> deleteReward(@PathVariable UUID rewardId) {
        rewardService.deleteReward(rewardId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{rewardId}/redeem")
    public ResponseEntity<Void> redeemReward(@PathVariable UUID rewardId) {
        rewardService.redeemReward(rewardId);
        return ResponseEntity.ok().build();
    }
}
