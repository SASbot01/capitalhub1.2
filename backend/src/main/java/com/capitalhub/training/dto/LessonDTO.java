package com.capitalhub.training.dto;

import lombok.Data;

@Data
public class LessonDTO {
    private Long id;
    private String title;
    private String duration;
    private String status; // "completed", "in-progress", "locked"
}
