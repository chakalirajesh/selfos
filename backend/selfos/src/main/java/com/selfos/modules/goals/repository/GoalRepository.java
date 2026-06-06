package com.selfos.modules.goals.repository;

import com.selfos.modules.goals.entity.GoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GoalRepository extends JpaRepository<GoalEntity, UUID> {
    
    // Scopes database queries within isolated multi-tenant parameters
    List<GoalEntity> findAllByUserId(UUID userId);
    
    // Validates cross-user tenant safety mapping directly on record access
    Optional<GoalEntity> findByIdAndUserId(UUID id, UUID userId);

    long countByUserId(UUID userId);

    long countByUserIdAndStatus(UUID userId, String status);
}