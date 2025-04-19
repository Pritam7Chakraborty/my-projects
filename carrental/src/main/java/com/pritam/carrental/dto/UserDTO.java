package com.pritam.carrental.dto;

import com.pritam.carrental.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {
    @NotBlank
    private String username;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private Role role; // Optional
}
