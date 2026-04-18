package com.gamify.platform.repository;

import com.gamify.platform.model.QuizSubmission;
import java.time.Instant;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizSubmissionRepository extends MongoRepository<QuizSubmission, String> {
    long countByUserId(String userId);
    List<QuizSubmission> findByUserId(String userId);
    List<QuizSubmission> findByUserIdAndSubmittedAtGreaterThanEqual(String userId, Instant submittedAt);
}
