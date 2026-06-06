package com.selfos.modules.habits.repository;

import com.selfos.modules.habits.entity.HabitEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HabitRepository extends JpaRepository<HabitEntity, UUID> {
    
    // Explicitly scope search sets within the user context space
    List<HabitEntity> findAllByUserId(UUID userId);
    
    // Ensures vertical multi-tenant lookup protection bounds
    Optional<HabitEntity> findByIdAndUserId(UUID id, UUID userId);
}