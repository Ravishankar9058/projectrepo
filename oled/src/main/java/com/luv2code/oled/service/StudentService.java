package com.luv2code.oled.service;

import com.luv2code.oled.model.School;
import com.luv2code.oled.model.Student;
import com.luv2code.oled.repository.SchoolRepository;
import com.luv2code.oled.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final SchoolRepository schoolRepository;

    public StudentService(StudentRepository studentRepository, SchoolRepository schoolRepository) {
        this.studentRepository = studentRepository;
        this.schoolRepository = schoolRepository;
    }

    public List<Student> getStudentsBySchool(Long schoolId) {
        return studentRepository.findBySchoolId(schoolId);
    }

    public ResponseEntity<?> addStudent(Long schoolId, Student student) {

        // Age validation logic: age must be >= 6 and <= 16
        if (student.getAge() < 6 || student.getAge() > 16) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Student age must be between 6 and 16"));
        }

        School school = schoolRepository.findById(schoolId).orElse(null);
        if (school == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "School not found with id: " + schoolId));
        }

        student.setSchool(school);
        return ResponseEntity.ok(studentRepository.save(student));
    }

    public ResponseEntity<?> updateStudent(Long schoolId, Long studentId, Student updated) {
        if (updated.getAge() < 6 || updated.getAge() > 16) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Student age must be between 6 and 16"));
        }

        Student existing = studentRepository.findById(studentId).orElse(null);
        if (existing == null || !schoolId.equals(existing.getSchool().getId())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Student not found in this school"));
        }

        existing.setName(updated.getName());
        existing.setStd(updated.getStd());
        existing.setAge(updated.getAge());
        existing.setClassName(updated.getClassName());
        return ResponseEntity.ok(studentRepository.save(existing));
    }

    public ResponseEntity<?> deleteStudent(Long schoolId, Long studentId) {
        Student existing = studentRepository.findById(studentId).orElse(null);
        if (existing == null || !schoolId.equals(existing.getSchool().getId())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Student not found in this school"));
        }
        studentRepository.delete(existing);
        return ResponseEntity.ok(Map.of("message", "Student deleted"));
    }
}
