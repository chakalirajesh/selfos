package com.selfos.modules.dashboard.dto;

public record DashboardResponse(
    long totalTasks,
    long completedTasks,
    long pendingTasks,
    long totalGoals,
    long completedGoals,
    long totalProjects,
    long activeProjects,
    long totalNotes,
    long totalHabits,
    long activeHabits
) {}