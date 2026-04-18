package com.gamify.platform.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalyticsResponse {

    private int dailyStreak;
    private double accuracyPercentage;
    private int totalQuizzesPlayed;
    private int totalCorrectAnswers;
    private int totalWrongAnswers;
    private List<WeeklyPointsData> weeklyPoints;
    private List<SubjectAccuracyData> subjectAccuracy;
    private MonthlyPerformanceSummary monthlySummary;
}
