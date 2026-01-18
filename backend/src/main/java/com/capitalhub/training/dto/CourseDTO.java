package com.capitalhub.training.dto;

import lombok.Data;
import java.util.List;

@Data
public class CourseDTO {
    private String id; // Encoded ID or just toString of Long
    private String title;
    private String level;
    private String focus;
    private int progress;
    private List<LessonDTO> lessons;
}
