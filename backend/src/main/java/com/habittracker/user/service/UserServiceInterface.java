package com.habittracker.user.service;

import com.habittracker.user.dto.UserRegisterDto;
import com.habittracker.user.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserServiceInterface {
    User loadUserByUsername(String username) throws UsernameNotFoundException;
}

