package com.selfos.modules.goals.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalResponse {
    private UUID id;
    private UUID userId;
    private String title;
    private String description;
    private OffsetDateTime targetDate;
    private Integer progress;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}