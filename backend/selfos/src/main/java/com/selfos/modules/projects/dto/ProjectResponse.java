package com.selfos.modules.projects.dto;

import lombok.Builder;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class ProjectResponse {
    private UUID id;
    private String name;
    private String description;
    private UUID ownerId;
    private int progress;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}