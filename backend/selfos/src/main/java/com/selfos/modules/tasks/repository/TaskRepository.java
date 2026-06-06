package com.selfos.modules.tasks.repository;

import com.selfos.modules.tasks.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {

    List<TaskEntity> findByUserId(UUID userId);

    long countByUserId(UUID userId);

    long countByUserIdAndStatus(UUID userId, String status);
}