package com.gamify.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyPerformanceSummary {

    private int quizzesPlayed;
    private int pointsEarned;
    private double accuracy;
}
