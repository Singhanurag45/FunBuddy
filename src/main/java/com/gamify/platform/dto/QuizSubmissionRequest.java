package com.gamify.platform.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmissionRequest {

    @NotBlank(message = "userId is required")
    private String userId;
    @Valid
    @NotEmpty(message = "answers are required")
    private List<SubmittedAnswerRequest> answers;
}
