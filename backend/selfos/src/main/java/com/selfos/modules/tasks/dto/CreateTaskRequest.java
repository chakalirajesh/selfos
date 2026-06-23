package com.selfos.modules.tasks.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class CreateTaskRequest {

    private String title;
    private String description;
    private String priority;
    private OffsetDateTime dueDate;
}