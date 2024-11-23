package com.habittracker.user.util;

import com.habittracker.user.dto.UserDetailsDto;
import com.habittracker.user.dto.UserListDto;
import com.habittracker.user.dto.UserRegisterDto;
import com.habittracker.user.dto.UserUpdateDto;
import com.habittracker.user.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserListDto toUserListDto(User user);
    UserDetailsDto toUserDetailsDto(User user);
    User toUser(UserRegisterDto userRegisterDto);
    User toUser(UserUpdateDto userUpdateDto);
}
