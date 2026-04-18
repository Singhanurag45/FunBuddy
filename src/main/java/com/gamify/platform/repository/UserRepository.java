package com.gamify.platform.repository;

import com.gamify.platform.model.User;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    List<User> findTop10ByOrderByPointsDesc();

    boolean existsByEmail(String email);

    java.util.Optional<User> findByEmail(String email);
}
