package com.habittracker.user.dto;

import com.habittracker.user.model.Role;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

//tu robimy walidacja
public class UserRegisterDto {

    @NotBlank(message = "Email cannot be empty.")
    @Email(message = "Email should be correct.")
    private String email;

    @NotBlank(message = "Password cannot be empty.")
    @Size(min = 8, message = "The password must be at least 8 characters long.")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "The password must contain at least one uppercase letter, one lowercase letter and one digit.")
    private String password;

    @NotBlank
    @Size
    private String firstName;

    @NotBlank
    @Size
    private String lastName;
}
