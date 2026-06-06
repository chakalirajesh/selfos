package com.selfos.modules.habits.service.impl;

import com.selfos.core.exception.ResourceNotFoundException;
import com.selfos.modules.habits.dto.*;
import com.selfos.modules.habits.entity.HabitEntity;
import com.selfos.modules.habits.repository.HabitRepository;
import com.selfos.modules.habits.service.HabitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class HabitServiceImpl implements HabitService {

    private final HabitRepository habitRepository;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public HabitResponse createHabit(CreateHabitRequest request, UUID userId) {
        log.info("Creating habit definition tracker '{}' for user target: {}", request.getName(), userId);

        HabitEntity entity = HabitEntity.builder()
                .userId(userId)
                .name(request.getName())
                .description(request.getDescription())
                .targetFrequency(request.getTargetFrequency())
                .createdBy(userId)
                .updatedBy(userId)
                .build();

        HabitEntity savedEntity = habitRepository.save(entity);
        return mapToResponse(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HabitResponse> getAllHabits(UUID userId) {
        log.info("Pulling personal tracking matrix lists for customer reference ID: {}", userId);
        return habitRepository.findAllByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HabitResponse getHabit(UUID id, UUID userId) {
        log.info("Reading structural information on habit node ID: {} for user: {}", id, userId);
        HabitEntity entity = habitRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Target habit tracking context profile could not be located."));
        return mapToResponse(entity);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public HabitResponse updateHabit(UUID id, UpdateHabitRequest request, UUID userId) {
        log.info("Committing lifecycle configuration updates directly onto data entity target block ID: {}", id);

        HabitEntity entity = habitRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Habit target not found or insufficient structural user access maps."));

        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setTargetFrequency(request.getTargetFrequency());
        entity.setStreakCount(request.getStreakCount());
        entity.setStatus(request.getStatus());
        entity.setUpdatedBy(userId);

        HabitEntity updatedEntity = habitRepository.save(entity);
        return mapToResponse(updatedEntity);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteHabit(UUID id, UUID userId) {
        log.info("Triggering absolute record drop execution flow sequence on database element: {}", id);
        HabitEntity entity = habitRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Habit item matching credentials could not be resolved."));
        
        habitRepository.delete(entity);
    }

    private HabitResponse mapToResponse(HabitEntity entity) {
        return HabitResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .name(entity.getName())
                .description(entity.getDescription())
                .targetFrequency(entity.getTargetFrequency())
                .streakCount(entity.getStreakCount())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}