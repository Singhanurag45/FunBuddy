package com.gamify.platform.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmittedAnswerRecord {

    private String questionId;
    private String subject;
    private String selectedAnswer;
    private boolean correct;
}
