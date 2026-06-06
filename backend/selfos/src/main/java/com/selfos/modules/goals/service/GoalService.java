package com.selfos.modules.goals.service;

import com.selfos.modules.goals.dto.*;
import java.util.List;
import java.util.UUID;

public interface GoalService {
    GoalResponse createGoal(CreateGoalRequest request, UUID userId);
    List<GoalResponse> getAllGoals(UUID userId);
    GoalResponse getGoal(UUID id, UUID userId);
    GoalResponse updateGoal(UUID id, UpdateGoalRequest request, UUID userId);
    void deleteGoal(UUID id, UUID userId);
}