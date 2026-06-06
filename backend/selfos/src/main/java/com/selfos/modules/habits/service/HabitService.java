package com.selfos.modules.habits.service;

import com.selfos.modules.habits.dto.*;
import java.util.List;
import java.util.UUID;

public interface HabitService {
    HabitResponse createHabit(CreateHabitRequest request, UUID userId);
    List<HabitResponse> getAllHabits(UUID userId);
    HabitResponse getHabit(UUID id, UUID userId);
    HabitResponse updateHabit(UUID id, UpdateHabitRequest request, UUID userId);
    void deleteHabit(UUID id, UUID userId);
}