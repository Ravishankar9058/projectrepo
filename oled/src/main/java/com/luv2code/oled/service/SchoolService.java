package com.luv2code.oled.service;

import com.luv2code.oled.model.School;
import com.luv2code.oled.model.User;
import com.luv2code.oled.repository.SchoolRepository;
import com.luv2code.oled.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;

    public SchoolService(SchoolRepository schoolRepository, UserRepository userRepository) {
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
    }

    // Returns only schools the current user is allowed to see
    public List<School> getAccessibleSchools() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        if (user == null) return List.of();

        if ("ADMIN".equals(user.getRole())) return schoolRepository.findAll();

        if (user.getSchool() != null) return List.of(user.getSchool());
        return List.of();
    }

    // Check if current user has access to a specific school
    public boolean hasAccess(Authentication auth, Long schoolId) {
        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        if (user == null) return false;
        if ("ADMIN".equals(user.getRole())) return true;
        return user.getSchool() != null && schoolId.equals(user.getSchool().getId());
    }

    public School findById(Long id) {
        return schoolRepository.findById(Objects.requireNonNull(id)).orElse(null);
    }
}
