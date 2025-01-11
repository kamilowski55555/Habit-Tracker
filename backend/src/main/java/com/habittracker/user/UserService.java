package com.habittracker.user;

import com.habittracker.common.exception.UserNotFoundException;
import com.habittracker.user.dto.NotificationEnableRequest;
import com.habittracker.user.dto.UserDetailsDto;
import com.habittracker.user.dto.UserRegisterDto;
import com.habittracker.user.dto.UserUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.UUID;

import static com.habittracker.common.util.SecurityContextUtils.getCurrentUserId;
import static com.habittracker.common.util.SecurityContextUtils.verifyResourceOwnership;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    public void registerUser(UserRegisterDto userDTO) {
        // Check if the user already exists
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email already exists");
        }

        userRepository.save(User.builder()
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .role(Role.ROLE_USER)
                .notificationsEnabled(true)
                .tokenVersion(UUID.randomUUID())
                .build());
    }

    public UserDetailsDto getUserDetails(UUID userId) {
        verifyResourceOwnership(userId);
        User user = getUserById(userId);
        return UserDetailsDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .goal(user.getGoal())
                .role(user.getRole().toString())
                .achievementFirstHabitCreatedDate(user.getAchievementFirstHabitCreatedDate())
                .achievementCompleteHabit50TimesSuccessfullyDate(user.getAchievementCompleteHabit50TimesSuccessfullyDate())
                .achievementSevenDayStreakDate(user.getAchievementSevenDayStreakDate())
                .notificationsEnabled(user.isNotificationsEnabled())
                .notificationTimes(user.getNotificationTimes())
                .currencyBalance(user.getCurrencyBalance())
                .createdAt(user.getCreatedAt())
                .modifiedAt(user.getModifiedAt())
                .build();
    }

    public void updateUser(UUID userId, UserUpdateDto updateDTO) {
        verifyResourceOwnership(userId);
        User user = getUserById(userId);

        if (updateDTO.getFirstName() != null){
            user.setFirstName(updateDTO.getFirstName());
        }
        if (updateDTO.getLastName() != null) {
            user.setLastName(updateDTO.getLastName());
        }
        if (updateDTO.getGoal() != null) {
            user.setGoal(updateDTO.getGoal());
        }

        userRepository.save(user);
    }

    public void addNotificationTime(UUID userId, LocalTime time) {
        verifyResourceOwnership(userId);
        User user = getUserById(userId);

        if (user.getNotificationTimes().size() >= 3) {
            throw new RuntimeException("Maximum of 3 notification times allowed");
        }

        user.getNotificationTimes().add(time);
        userRepository.save(user);
    }

    // 3) Remove a time
    public void removeNotificationTime(UUID userId, LocalTime time) {
        verifyResourceOwnership(userId);
        User user = getUserById(userId);


        user.getNotificationTimes().remove(time);
        userRepository.save(user);
    }

    // 4) Toggle notificationsEnabled (or set it explicitly)
    public void updateNotificationsEnabled(UUID userId, NotificationEnableRequest request) {
        verifyResourceOwnership(userId);
        User user = getUserById(userId);

        user.setNotificationsEnabled(request.isEnabled());
        userRepository.save(user);
    }

    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
    }

}

