package com.luv2code.oled.config;

import com.luv2code.oled.model.School;
import com.luv2code.oled.model.User;
import com.luv2code.oled.repository.SchoolRepository;
import com.luv2code.oled.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(SchoolRepository schoolRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Seed schools if empty
        if (schoolRepository.count() == 0) {
            schoolRepository.save(new School("Green Valley School"));
            schoolRepository.save(new School("Blue Hills School"));
            schoolRepository.save(new School("Sunrise Academy"));
            System.out.println(">>> 3 Schools created successfully!");
        }

        // Get schools sorted by ID
        List<School> schools = schoolRepository.findAll().stream()
                .sorted(Comparator.comparing(School::getId))
                .toList();

        // Seed each user individually if they don't already exist
        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(new User("admin", passwordEncoder.encode("admin123"), "ADMIN", null));
            System.out.println(">>> User 'admin' created.");
        }
        if (userRepository.findByUsername("user1").isEmpty() && schools.size() >= 1) {
            userRepository.save(new User("user1", passwordEncoder.encode("user123"), "USER", schools.get(0)));
            System.out.println(">>> User 'user1' created.");
        }
        if (userRepository.findByUsername("user2").isEmpty() && schools.size() >= 2) {
            userRepository.save(new User("user2", passwordEncoder.encode("user123"), "USER", schools.get(1)));
            System.out.println(">>> User 'user2' created.");
        }
        if (userRepository.findByUsername("user3").isEmpty() && schools.size() >= 3) {
            userRepository.save(new User("user3", passwordEncoder.encode("user123"), "USER", schools.get(2)));
            System.out.println(">>> User 'user3' created.");
        }
    }
}
