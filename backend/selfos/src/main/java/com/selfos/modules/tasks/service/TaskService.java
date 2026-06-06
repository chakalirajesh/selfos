package com.selfos.modules.tasks.service;

import com.selfos.modules.tasks.dto.CreateTaskRequest;
import com.selfos.modules.tasks.dto.TaskResponse;
import com.selfos.modules.tasks.dto.UpdateTaskRequest;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request, UUID userId);

    List<TaskResponse> getAllTasks();

    TaskResponse getTask(UUID id);

    void deleteTask(UUID id);

    TaskResponse updateTask(UUID id, UpdateTaskRequest request);
}