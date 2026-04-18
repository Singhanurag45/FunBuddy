package com.gamify.platform.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    private String id;
    @NotBlank(message = "subject is required")
    private String subject;
    @NotBlank(message = "questionText is required")
    private String questionText;
    @NotEmpty(message = "options are required")
    private List<String> options;
    @NotBlank(message = "correctAnswer is required")
    private String correctAnswer;
    @NotBlank(message = "classLevel is required")
    private String classLevel;
}
