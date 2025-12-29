package com.pritam.foodie;

import com.pritam.foodie.model.Role;
import com.pritam.foodie.model.User;
import com.pritam.foodie.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class FoodieApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodieApplication.class, args);
	}



	@Bean
	public CommandLineRunner run(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Check if admin exists, if not, create one
			if (!userRepository.existsByEmail("admin@foodie.com")) {
				User admin = new User();
				admin.setFullName("Super Admin");
				admin.setEmail("admin@foodie.com");
				admin.setPassword(passwordEncoder.encode("admin123")); // Encrypt password
				admin.setRole(Role.ADMIN);

				userRepository.save(admin);
				System.out.println("✅ ADMIN USER CREATED: admin@foodie.com / admin123");
			}
		};
	}
}