package com.gamify.platform.model;

import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "quiz_submissions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmission {

    @Id
    private String id;
    private String userId;
    private List<SubmittedAnswerRecord> answers;
    private int totalScore;
    private int correctAnswersCount;
    private int updatedPoints;
    private int updatedLevel;
    private Instant submittedAt;
}
