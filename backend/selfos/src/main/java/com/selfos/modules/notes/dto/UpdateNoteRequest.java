package com.selfos.modules.notes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNoteRequest {

    @NotBlank(message = "Note title cannot be blank")
    @Size(max = 255, message = "Note title must not exceed 255 characters")
    private String title;

    @Size(max = 50000, message = "Note content size must not exceed 50,000 characters")
    private String content;
}