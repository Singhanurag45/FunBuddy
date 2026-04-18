package com.gamify.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class QuizSubmissionResponse {

    private int totalScore;
    private int bonusPoints;
    private int correctAnswersCount;
    private int updatedPoints;
    private int updatedLevel;
    private long submissionCount;
}
