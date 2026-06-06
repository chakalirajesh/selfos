package com.selfos.modules.tasks.controller;

import com.selfos.modules.tasks.dto.CreateTaskRequest;
import com.selfos.modules.tasks.dto.TaskResponse;
import com.selfos.modules.tasks.dto.UpdateTaskRequest;
import com.selfos.modules.tasks.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
        @RequestBody CreateTaskRequest request,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(
            taskService.createTask(
                    request,
                    UUID.fromString(userId)
            )
        );
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getTask(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable UUID id,
            @RequestBody UpdateTaskRequest request) {

        return ResponseEntity.ok(taskService.updateTask(id, request));
    }
}