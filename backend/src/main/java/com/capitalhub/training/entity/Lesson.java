package com.capitalhub.training.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String videoUrl;
    private String duration;
    private Integer position;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Optional: relation if needed, but keeping simple for now
    // @ManyToOne
    // @JoinColumn(name = "course_id", insertable = false, updatable = false)
    // private Course course;
}
