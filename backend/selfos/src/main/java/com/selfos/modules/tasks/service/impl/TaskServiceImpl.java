package com.selfos.modules.tasks.service.impl;

import com.selfos.modules.tasks.dto.CreateTaskRequest;
import com.selfos.modules.tasks.dto.TaskResponse;
import com.selfos.modules.tasks.dto.UpdateTaskRequest;
import com.selfos.modules.tasks.entity.TaskEntity;
import com.selfos.modules.tasks.repository.TaskRepository;
import com.selfos.modules.tasks.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import com.selfos.modules.tasks.dto.UpdateTaskRequest;


@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public TaskResponse createTask(CreateTaskRequest request) {

       UUID testUserId = UUID.fromString(
                "e472cd0a-9d45-41aa-b258-7a4cd7137612"
        );

        TaskEntity task = TaskEntity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status("TODO")
                .userId(testUserId)
                .createdBy(testUserId)
                .updatedBy(testUserId)
                .dueDate(request.getDueDate())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        TaskEntity savedTask = taskRepository.save(task);

        return TaskResponse.builder()
                .id(savedTask.getId())
                .title(savedTask.getTitle())
                .description(savedTask.getDescription())
                .status(savedTask.getStatus())
                .priority(savedTask.getPriority())
                .build();
    }

    @Override
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(task -> TaskResponse.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .description(task.getDescription())
                        .status(task.getStatus())
                        .priority(task.getPriority())
                        .build())
                .toList();
    }
    @Override
    public TaskResponse getTask(UUID id) {

        TaskEntity task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .build();
    }

    @Override
    public void deleteTask(UUID id) {
        taskRepository.deleteById(id);
    }
    @Override
    public TaskResponse updateTask(UUID id, UpdateTaskRequest request) {

        TaskEntity task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());
        task.setUpdatedAt(OffsetDateTime.now());

        TaskEntity updatedTask = taskRepository.save(task);

        return TaskResponse.builder()
                .id(updatedTask.getId())
                .title(updatedTask.getTitle())
                .description(updatedTask.getDescription())
                .status(updatedTask.getStatus())
                .priority(updatedTask.getPriority())
                .build();
    }
}