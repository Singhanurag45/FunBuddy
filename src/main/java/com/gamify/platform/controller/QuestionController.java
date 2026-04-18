package com.gamify.platform.controller;

import com.gamify.platform.dto.DashboardAnalyticsResponse;
import com.gamify.platform.dto.QuizSubmissionRequest;
import com.gamify.platform.dto.QuizSubmissionResponse;
import com.gamify.platform.model.Question;
import com.gamify.platform.service.QuestionService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<Question> addQuestion(@Valid @RequestBody Question question) {
        Question savedQuestion = questionService.addQuestion(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedQuestion);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Question>> addQuestions(@Valid @RequestBody List<@Valid Question> questions) {
        List<Question> savedQuestions = questionService.addQuestions(questions);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedQuestions);
    }

    @GetMapping
    public ResponseEntity<List<Question>> getQuestionsBySubjectAndClassLevel(
            @RequestParam String subject,
            @RequestParam String classLevel) {
        List<Question> questions = questionService.getQuestionsBySubjectAndClassLevel(subject, classLevel);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizSubmissionResponse> submitQuiz(@Valid @RequestBody QuizSubmissionRequest submissionRequest) {
        QuizSubmissionResponse submissionResponse = questionService.submitQuiz(submissionRequest);
        return ResponseEntity.ok(submissionResponse);
    }

    @GetMapping("/analytics")
    public ResponseEntity<DashboardAnalyticsResponse> getDashboardAnalytics(@RequestParam String userId) {
        DashboardAnalyticsResponse analytics = questionService.getDashboardAnalytics(userId);
        return ResponseEntity.ok(analytics);
    }
}
