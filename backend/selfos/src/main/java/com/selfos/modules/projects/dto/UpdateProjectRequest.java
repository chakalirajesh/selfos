package com.selfos.modules.projects.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProjectRequest {

    @NotBlank(message = "Project name is required and cannot be blank")
    @Size(max = 255, message = "Project name must not exceed 255 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Min(value = 0, message = "Progress metric cannot fall below 0 percent")
    @Max(value = 100, message = "Progress metric cannot exceed 100 percent")
    private int progress;

    @NotBlank(message = "Status condition state is required")
    @Pattern(regexp = "^(PLANNED|ACTIVE|COMPLETED|ON_HOLD)$", 
             message = "Status must be exactly one of: PLANNED, ACTIVE, COMPLETED, or ON_HOLD")
    private String status;
}