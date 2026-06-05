package com.selfos.modules.tasks.dto;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class UpdateTaskRequest {
    private String title;
    private String description;
    private Integer priority;
    private String status;
    private OffsetDateTime dueDate;
}