package com.selfos.modules.tasks.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class TaskResponse {

    private UUID id;
    private String title;
    private String description;
    private String status;
    private String priority;
}