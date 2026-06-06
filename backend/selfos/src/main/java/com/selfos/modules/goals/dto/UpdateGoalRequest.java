package com.selfos.modules.goals.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGoalRequest {

    @NotBlank(message = "Goal title cannot be blank")
    @Size(max = 255, message = "Goal title must not exceed 255 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private OffsetDateTime targetDate;

    @NotNull(message = "Progress completion percentage is required")
    @Min(value = 0, message = "Progress metric cannot fall below 0 percent")
    @Max(value = 100, message = "Progress metric cannot exceed 100 percent")
    private Integer progress;

    @NotBlank(message = "Status condition state validation parameter is required")
    @Pattern(
        regexp = "^(NOT_STARTED|IN_PROGRESS|COMPLETED)$", 
             message = "Status value must strictly align with one of: ACTIVE, PAUSED, or COMPLETED")
    private String status;
}