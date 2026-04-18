package com.gamify.platform.repository;

import com.gamify.platform.model.Question;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {

	List<Question> findBySubjectAndClassLevel(String subject, String classLevel);
}