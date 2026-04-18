package com.gamify.platform.service;

import com.gamify.platform.dto.DashboardAnalyticsResponse;
import com.gamify.platform.dto.MonthlyPerformanceSummary;
import com.gamify.platform.dto.QuizSubmissionRequest;
import com.gamify.platform.dto.QuizSubmissionResponse;
import com.gamify.platform.dto.SubjectAccuracyData;
import com.gamify.platform.dto.SubmittedAnswerRequest;
import com.gamify.platform.dto.WeeklyPointsData;
import com.gamify.platform.model.QuizSubmission;
import com.gamify.platform.model.Question;
import com.gamify.platform.model.SubmittedAnswerRecord;
import com.gamify.platform.model.User;
import com.gamify.platform.repository.QuestionRepository;
import com.gamify.platform.repository.QuizSubmissionRepository;
import com.gamify.platform.repository.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private static final int POINTS_PER_CORRECT_ANSWER = 10;
    private static final int QUIZ_COMPLETION_BONUS_POINTS = 20;
    private static final int EVERY_THIRD_QUIZ_BONUS_POINTS = 50;
    private static final int PERFECT_SCORE_BONUS_POINTS = 50;
    private static final int LEVEL_UP_THRESHOLD = 100;

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> addQuestions(List<Question> questions) {
        return questionRepository.saveAll(questions);
    }

    public List<Question> getQuestionsBySubjectAndClassLevel(String subject, String classLevel) {
        return questionRepository.findBySubjectAndClassLevel(subject, classLevel);
    }

    public QuizSubmissionResponse submitQuiz(QuizSubmissionRequest submissionRequest) {
        if (submissionRequest == null || submissionRequest.getUserId() == null || submissionRequest.getUserId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }

        User user = userRepository.findById(submissionRequest.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<SubmittedAnswerRequest> submittedAnswers = submissionRequest.getAnswers() == null
                ? Collections.emptyList()
                : submissionRequest.getAnswers();

        List<String> questionIds = submittedAnswers.stream()
                .map(SubmittedAnswerRequest::getQuestionId)
                .filter(questionId -> questionId != null && !questionId.isBlank())
                .toList();

        Map<String, Question> questionsById = questionRepository.findAllById(questionIds).stream()
                .collect(Collectors.toMap(Question::getId, Function.identity()));

        int correctAnswersCount = 0;
        List<SubmittedAnswerRecord> answerRecords = new ArrayList<>();
        for (SubmittedAnswerRequest submittedAnswer : submittedAnswers) {
            Question question = questionsById.get(submittedAnswer.getQuestionId());
            boolean isCorrect = question != null
                    && question.getCorrectAnswer() != null
                    && question.getCorrectAnswer().equals(submittedAnswer.getSelectedAnswer());

            if (isCorrect) {
                correctAnswersCount++;
            }

            answerRecords.add(SubmittedAnswerRecord.builder()
                    .questionId(submittedAnswer.getQuestionId())
                    .subject(question != null ? question.getSubject() : "Unknown")
                    .selectedAnswer(submittedAnswer.getSelectedAnswer())
                    .correct(isCorrect)
                    .build());
        }

        long previousSubmissionCount = quizSubmissionRepository.countByUserId(user.getId());
        long currentSubmissionCount = previousSubmissionCount + 1;

        int baseScore = correctAnswersCount * POINTS_PER_CORRECT_ANSWER;
        int completionBonus = QUIZ_COMPLETION_BONUS_POINTS;
        int thirdQuizBonus = currentSubmissionCount % 3 == 0 ? EVERY_THIRD_QUIZ_BONUS_POINTS : 0;
        int perfectScoreBonus = submittedAnswers.isEmpty() ? 0
                : (correctAnswersCount == submittedAnswers.size() ? PERFECT_SCORE_BONUS_POINTS : 0);
        int bonusPoints = completionBonus + thirdQuizBonus + perfectScoreBonus;
        int totalScore = baseScore + bonusPoints;

        int currentPoints = user.getPoints() == null ? 0 : user.getPoints();
        int currentLevel = user.getLevel() == null || user.getLevel() < 1 ? 1 : user.getLevel();
        int updatedPoints = currentPoints + totalScore;
        int levelsEarned = (updatedPoints / LEVEL_UP_THRESHOLD) - (currentPoints / LEVEL_UP_THRESHOLD);
        int updatedLevel = currentLevel + Math.max(levelsEarned, 0);

        user.setPoints(updatedPoints);
        user.setLevel(updatedLevel);
        userRepository.save(user);

        QuizSubmission quizSubmission = QuizSubmission.builder()
                .userId(user.getId())
                .answers(answerRecords)
                .totalScore(totalScore)
                .correctAnswersCount(correctAnswersCount)
                .updatedPoints(updatedPoints)
                .updatedLevel(updatedLevel)
                .submittedAt(Instant.now())
                .build();
        quizSubmissionRepository.save(quizSubmission);

        return QuizSubmissionResponse.builder()
                .totalScore(totalScore)
                .bonusPoints(bonusPoints)
                .correctAnswersCount(correctAnswersCount)
                .updatedPoints(updatedPoints)
                .updatedLevel(updatedLevel)
                .submissionCount(currentSubmissionCount)
                .build();
    }

    public DashboardAnalyticsResponse getDashboardAnalytics(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }

        userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<QuizSubmission> submissions = quizSubmissionRepository.findByUserId(userId);
        submissions.sort(Comparator.comparing(QuizSubmission::getSubmittedAt, Comparator.nullsLast(Comparator.naturalOrder())));

        int totalQuizzesPlayed = submissions.size();
        int totalCorrectAnswers = submissions.stream().mapToInt(QuizSubmission::getCorrectAnswersCount).sum();
        int totalAnswers = submissions.stream()
                .map(QuizSubmission::getAnswers)
                .filter(answers -> answers != null)
                .mapToInt(List::size)
                .sum();
        int totalWrongAnswers = Math.max(totalAnswers - totalCorrectAnswers, 0);
        double accuracyPercentage = totalAnswers == 0 ? 0 : roundToTwoDecimals((double) totalCorrectAnswers * 100 / totalAnswers);

        List<WeeklyPointsData> weeklyPoints = buildWeeklyPoints(submissions);
        List<SubjectAccuracyData> subjectAccuracy = buildSubjectAccuracy(submissions);
        int dailyStreak = computeDailyStreak(submissions);
        MonthlyPerformanceSummary monthlySummary = buildMonthlySummary(submissions);

        return DashboardAnalyticsResponse.builder()
                .dailyStreak(dailyStreak)
                .accuracyPercentage(accuracyPercentage)
                .totalQuizzesPlayed(totalQuizzesPlayed)
                .totalCorrectAnswers(totalCorrectAnswers)
                .totalWrongAnswers(totalWrongAnswers)
                .weeklyPoints(weeklyPoints)
                .subjectAccuracy(subjectAccuracy)
                .monthlySummary(monthlySummary)
                .build();
    }

    private List<WeeklyPointsData> buildWeeklyPoints(List<QuizSubmission> submissions) {
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(6);
        Map<LocalDate, Integer> pointsByDate = new HashMap<>();

        for (QuizSubmission submission : submissions) {
            if (submission.getSubmittedAt() == null) {
                continue;
            }
            LocalDate submissionDate = submission.getSubmittedAt().atZone(ZoneId.systemDefault()).toLocalDate();
            if (submissionDate.isBefore(start) || submissionDate.isAfter(today)) {
                continue;
            }
            pointsByDate.merge(submissionDate, submission.getTotalScore(), Integer::sum);
        }

        List<WeeklyPointsData> weeklyData = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = start.plusDays(i);
            weeklyData.add(WeeklyPointsData.builder()
                    .day(date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .points(pointsByDate.getOrDefault(date, 0))
                    .build());
        }
        return weeklyData;
    }

    private List<SubjectAccuracyData> buildSubjectAccuracy(List<QuizSubmission> submissions) {
        Map<String, Integer> totalBySubject = new HashMap<>();
        Map<String, Integer> correctBySubject = new HashMap<>();

        for (QuizSubmission submission : submissions) {
            if (submission.getAnswers() == null) {
                continue;
            }
            for (SubmittedAnswerRecord answer : submission.getAnswers()) {
                String subject = answer.getSubject() == null || answer.getSubject().isBlank()
                        ? "Unknown"
                        : answer.getSubject();
                totalBySubject.merge(subject, 1, Integer::sum);
                if (answer.isCorrect()) {
                    correctBySubject.merge(subject, 1, Integer::sum);
                }
            }
        }

        List<String> supportedSubjects = List.of("Math", "Science", "English");
        List<SubjectAccuracyData> data = new ArrayList<>();
        for (String subject : supportedSubjects) {
            int total = totalBySubject.getOrDefault(subject, 0);
            int correct = correctBySubject.getOrDefault(subject, 0);
            double accuracy = total == 0 ? 0 : roundToTwoDecimals((double) correct * 100 / total);
            data.add(SubjectAccuracyData.builder()
                    .subject(subject)
                    .accuracy(accuracy)
                    .build());
        }
        return data;
    }

    private int computeDailyStreak(List<QuizSubmission> submissions) {
        if (submissions.isEmpty()) {
            return 0;
        }

        List<LocalDate> uniqueDatesDesc = submissions.stream()
                .map(QuizSubmission::getSubmittedAt)
                .filter(submittedAt -> submittedAt != null)
                .map(submittedAt -> submittedAt.atZone(ZoneId.systemDefault()).toLocalDate())
                .distinct()
                .sorted(Comparator.reverseOrder())
                .toList();

        if (uniqueDatesDesc.isEmpty()) {
            return 0;
        }

        LocalDate today = LocalDate.now();
        LocalDate cursor = uniqueDatesDesc.get(0);
        if (!(cursor.equals(today) || cursor.equals(today.minusDays(1)))) {
            return 0;
        }

        int streak = 1;
        for (int i = 1; i < uniqueDatesDesc.size(); i++) {
            LocalDate expected = cursor.minusDays(1);
            LocalDate current = uniqueDatesDesc.get(i);
            if (current.equals(expected)) {
                streak++;
                cursor = current;
            } else {
                break;
            }
        }
        return streak;
    }

    private MonthlyPerformanceSummary buildMonthlySummary(List<QuizSubmission> submissions) {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        int quizzesPlayed = 0;
        int pointsEarned = 0;
        int totalAnswers = 0;
        int totalCorrect = 0;

        for (QuizSubmission submission : submissions) {
            if (submission.getSubmittedAt() == null) {
                continue;
            }
            LocalDate date = submission.getSubmittedAt().atZone(ZoneId.systemDefault()).toLocalDate();
            if (date.getYear() != year || date.getMonthValue() != month) {
                continue;
            }
            quizzesPlayed++;
            pointsEarned += submission.getTotalScore();
            totalCorrect += submission.getCorrectAnswersCount();
            totalAnswers += submission.getAnswers() == null ? 0 : submission.getAnswers().size();
        }

        double accuracy = totalAnswers == 0 ? 0 : roundToTwoDecimals((double) totalCorrect * 100 / totalAnswers);
        return MonthlyPerformanceSummary.builder()
                .quizzesPlayed(quizzesPlayed)
                .pointsEarned(pointsEarned)
                .accuracy(accuracy)
                .build();
    }

    private double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
