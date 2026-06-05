package com.selfos.modules.tasks.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class CreateTaskRequest {

    private String title;
    private String description;
    private Integer priority;
    private OffsetDateTime dueDate;
}