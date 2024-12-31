package com.habittracker.reward;

import com.habittracker.common.exception.InsufficientFundsException;
import com.habittracker.common.exception.ResourceAccessDeniedException;
import com.habittracker.common.util.SecurityContextUtils;
import com.habittracker.reward.dto.RewardCreateDto;
import com.habittracker.reward.dto.RewardDetailsDto;
import com.habittracker.reward.dto.RewardListDto;
import com.habittracker.reward.dto.RewardModifyDto;
import com.habittracker.user.User;
import com.habittracker.user.UserRepository;
import com.habittracker.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    public List<RewardListDto> getUserRewards() {

        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        return rewardRepository.findByUserId(currentUserId)
                .stream()
                .map(reward -> RewardListDto.builder()
                        .id(reward.getId())
                        .name(reward.getName())
                        .cost(reward.getCost())
                        .build())
                .toList();
    }

    @Transactional
    public UUID createReward(RewardCreateDto rewardCreateDto) {
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        User user = userService.getUserById(currentUserId);
        Reward reward = Reward.builder()
                .name(rewardCreateDto.getName())
                .cost(rewardCreateDto.getCost())
                .user(user)
                .build();
        rewardRepository.save(reward);
        return reward.getId();
    }

    public RewardDetailsDto getRewardDetails(UUID rewardId) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new IllegalArgumentException("Reward not found with ID: " + rewardId));
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        if (!reward.getUser().getId().equals(currentUserId)) {
            throw new ResourceAccessDeniedException("You do not have permission to access this resource.");
        }
        return RewardDetailsDto.builder()
                .name(reward.getName())
                .cost(reward.getCost())
                .createdAt(reward.getCreatedAt())
                .modifiedAt(reward.getModifiedAt())
                .build();
    }

    @Transactional
    public UUID modifyReward(UUID rewardId, RewardModifyDto rewardModifyDto) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new IllegalArgumentException("Reward not found with ID: " + rewardId));
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        if (!reward.getUser().getId().equals(currentUserId)) {
            throw new ResourceAccessDeniedException("You do not have permission to access this resource.");
        }
        if (rewardModifyDto.getName() != null) {
            reward.setName(rewardModifyDto.getName());
        }
        if (rewardModifyDto.getCost() != 0) {
            reward.setCost(rewardModifyDto.getCost());
        }

        rewardRepository.save(reward);
        return reward.getId();
    }

    public void deleteReward(UUID rewardId) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new IllegalArgumentException("Reward not found with ID: " + rewardId));
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        if (!reward.getUser().getId().equals(currentUserId)) {
            throw new ResourceAccessDeniedException("You do not have permission to access this resource.");
        }
        rewardRepository.delete(reward);
    }

    @Transactional
    public void redeemReward(UUID rewardId) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new IllegalArgumentException("Reward not found with ID: " + rewardId));
        UUID currentUserId = SecurityContextUtils.getCurrentUserId();
        if (!reward.getUser().getId().equals(currentUserId)) {
            throw new ResourceAccessDeniedException("You do not have permission to access this resource.");
        }
        User user = reward.getUser();
        int cost = reward.getCost();
        if (user.getCurrencyBalance() >= cost) {
            user.setCurrencyBalance(user.getCurrencyBalance() - cost);
            userRepository.save(user);
        } else {
            throw new InsufficientFundsException("Insufficient funds to redeem reward");
        }
    }
}
