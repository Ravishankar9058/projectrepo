package com.luv2code.oled.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int age;
    private String std;        // Standard/Grade (e.g. 5, 6, 7)
    private String className;  // Class section (e.g. A, B, C)

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

    public Student() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getStd() { return std; }
    public void setStd(String std) { this.std = std; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public School getSchool() { return school; }
    public void setSchool(School school) { this.school = school; }
}
