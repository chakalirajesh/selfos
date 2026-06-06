package com.selfos.modules.dashboard.service.impl;

import com.selfos.modules.dashboard.dto.DashboardResponse;
import com.selfos.modules.dashboard.service.DashboardService;
import com.selfos.modules.tasks.repository.TaskRepository;
import com.selfos.modules.goals.repository.GoalRepository;
import com.selfos.modules.projects.repository.ProjectRepository;
import com.selfos.modules.notes.repository.NoteRepository;
import com.selfos.modules.habits.repository.HabitRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TaskRepository taskRepository;
    private final GoalRepository goalRepository;
    private final ProjectRepository projectRepository;
    private final NoteRepository noteRepository;
    private final HabitRepository habitRepository;

    @Override
    public DashboardResponse getDashboard(UUID userId) {

        long totalTasks = taskRepository.countByUserId(userId);

        long completedTasks =
                taskRepository.countByUserIdAndStatus(userId, "COMPLETED");

        long pendingTasks =
                taskRepository.countByUserIdAndStatus(userId, "TODO");

        long totalGoals =
                goalRepository.countByUserId(userId);

        long completedGoals =
                goalRepository.countByUserIdAndStatus(userId, "COMPLETED");

        long totalProjects =
                projectRepository.countByOwnerId(userId);

        long activeProjects =
                projectRepository.countByOwnerIdAndStatus(userId, "ACTIVE");

        long totalNotes =
                noteRepository.countByUserId(userId);

        long totalHabits =
                habitRepository.countByUserId(userId);

        long activeHabits =
                habitRepository.countByUserIdAndStatus(userId, "ACTIVE");

        return new DashboardResponse(
                totalTasks,
                completedTasks,
                pendingTasks,
                totalGoals,
                completedGoals,
                totalProjects,
                activeProjects,
            totalNotes,
            totalHabits,
            activeHabits
        );
    }
}