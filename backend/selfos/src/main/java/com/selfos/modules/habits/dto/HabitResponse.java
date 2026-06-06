package com.selfos.modules.habits.dto;

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
public class HabitResponse {
    private UUID id;
    private UUID userId;
    private String name;
    private String description;
    private Integer targetFrequency;
    private Integer streakCount;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}