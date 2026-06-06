package com.selfos.modules.habits.controller;

import com.selfos.modules.habits.dto.*;
import com.selfos.modules.habits.service.HabitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/habits")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Habit Tracking Module", description = "Endpoints handling behavioral routines, targeted execution frequencies, and streak analytics parameters.")
public class HabitController {

    private final HabitService habitService;

    @PostMapping
    @Operation(summary = "Establish a new tracked behavioral metric", description = "Generates a dynamic habit tracker entity pinned explicitly to the authenticating user context payload.")
    public ResponseEntity<HabitResponse> createHabit(
            @Valid @RequestBody CreateHabitRequest request,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Controller Ingress: Received creation routing validation payload from user context principal identifier: {}", userId);
        HabitResponse response = habitService.createHabit(request, UUID.fromString(userId));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Enumerate tracked routines for the current signature profile", description = "Extracts collection slices strictly restricted to ownership patterns associated with the active identity token.")
    public ResponseEntity<List<HabitResponse>> getAllHabits(@AuthenticationPrincipal String userId) {
        log.info("API Controller Ingress: Handling array slice query fetch configurations for principal context: {}", userId);
        List<HabitResponse> responses = habitService.getAllHabits(UUID.fromString(userId));
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Examine a target tracking context metrics row", description = "Returns core state configuration properties of a tracking block if authorization parameters validate cleanly.")
    public ResponseEntity<HabitResponse> getHabit(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Controller Ingress: Processing item extraction query on profile identification index: {}", id);
        HabitResponse response = habitService.getHabit(id, UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modify tracking parameters, frequency states, or streak metrics", description = "Updates configuration metrics if security context profiles confirm permission settings.")
    public ResponseEntity<HabitResponse> updateHabit(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateHabitRequest request,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Controller Ingress: Passing programmatic updates down to database target layer entry point: {}", id);
        HabitResponse response = habitService.updateHabit(id, request, UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Completely dissolve a behavioral tracker from persistence records", description = "Drops structural layout details permanently from the data matrix tier.")
    public ResponseEntity<Void> deleteHabit(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Controller Ingress: Invoking resource purge mechanics on row tracking index: {}", id);
        habitService.deleteHabit(id, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }
}