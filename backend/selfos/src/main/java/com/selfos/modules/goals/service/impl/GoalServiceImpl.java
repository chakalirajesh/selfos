package com.selfos.modules.goals.service.impl;

import com.selfos.core.exception.ResourceNotFoundException;
import com.selfos.modules.goals.dto.*;
import com.selfos.modules.goals.entity.GoalEntity;
import com.selfos.modules.goals.repository.GoalRepository;
import com.selfos.modules.goals.service.GoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.time.OffsetDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public GoalResponse createGoal(CreateGoalRequest request, UUID userId) {
        log.info("Provisioning execution flow data for new goal entry '{}' under user ID: {}", request.getTitle(), userId);

        GoalEntity entity = GoalEntity.builder()
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .startDate(OffsetDateTime.now())
                .targetDate(request.getTargetDate())
                .progress(0)
                .progressPercentage(0)
                .status("NOT_STARTED")
                .createdBy(userId)
                .updatedBy(userId)
                .build();

        GoalEntity savedEntity = goalRepository.save(entity);
        return mapToResponse(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GoalResponse> getAllGoals(UUID userId) {
        log.info("Assembling structural goal matrix batch lookup for user identifier: {}", userId);
        return goalRepository.findAllByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public GoalResponse getGoal(UUID id, UUID userId) {
        log.info("Requesting targeted data model pull for goal item ID: {} via caller context: {}", id, userId);
        GoalEntity entity = goalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Target goal tracking record not found or access execution blocked."));
        return mapToResponse(entity);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public GoalResponse updateGoal(UUID id, UpdateGoalRequest request, UUID userId) {
        log.info("Committing data modification values into objective placeholder node index: {}", id);

        GoalEntity entity = goalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Target goal configuration could not be resolved under your identity."));

        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setTargetDate(request.getTargetDate());
        entity.setProgress(request.getProgress());
        entity.setStatus(request.getStatus());
        entity.setUpdatedBy(userId);

        GoalEntity updatedEntity = goalRepository.save(entity);
        return mapToResponse(updatedEntity);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteGoal(UUID id, UUID userId) {
        log.info("Invoking permanent record wipe on data row entity trace: {}", id);
        GoalEntity entity = goalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal entity execution targets failed resolution checks."));
        
        goalRepository.delete(entity);
    }

    private GoalResponse mapToResponse(GoalEntity entity) {
        return GoalResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .targetDate(entity.getTargetDate())
                .progress(entity.getProgress())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}