package com.luv2code.oled.controller;

import com.luv2code.oled.model.Student;
import com.luv2code.oled.service.SchoolService;
import com.luv2code.oled.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/schools")
public class SchoolController {

    private final SchoolService schoolService;
    private final StudentService studentService;

    public SchoolController(SchoolService schoolService, StudentService studentService) {
        this.schoolService = schoolService;
        this.studentService = studentService;
    }

    // GET /schools
    @GetMapping
    public ResponseEntity<?> getAllSchools() {
        return ResponseEntity.ok(schoolService.getAccessibleSchools());
    }

    // GET /schools/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getSchoolById(@PathVariable Long id) {
        var school = schoolService.findById(id);
        if (school == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(school);
    }

    // GET /schools/{schoolId}/students
    @GetMapping("/{schoolId}/students")
    public ResponseEntity<?> getStudents(@PathVariable Long schoolId) {
        return ResponseEntity.ok(studentService.getStudentsBySchool(schoolId));
    }

    // POST /schools/{schoolId}/students
    @PostMapping("/{schoolId}/students")
    public ResponseEntity<?> addStudent(@PathVariable Long schoolId,
                                        @RequestBody Student student) {
        return studentService.addStudent(schoolId, student);
    }

    // PUT /schools/{schoolId}/students/{studentId}
    @PutMapping("/{schoolId}/students/{studentId}")
    public ResponseEntity<?> updateStudent(@PathVariable Long schoolId,
                                           @PathVariable Long studentId,
                                           @RequestBody Student student) {
        return studentService.updateStudent(schoolId, studentId, student);
    }

    // DELETE /schools/{schoolId}/students/{studentId}
    @DeleteMapping("/{schoolId}/students/{studentId}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long schoolId,
                                           @PathVariable Long studentId) {
        return studentService.deleteStudent(schoolId, studentId);
    }
}
