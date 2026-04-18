package com.gamify.platform.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmittedAnswerRequest {

    @NotBlank(message = "questionId is required")
    private String questionId;
    @NotBlank(message = "selectedAnswer is required")
    private String selectedAnswer;
}
