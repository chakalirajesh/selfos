package com.selfos.modules.goals.controller;

import com.selfos.modules.goals.dto.*;
import com.selfos.modules.goals.service.GoalService;
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
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Goals Management Module", description = "Endpoints processing personal vision tracking indices, temporal checkpoints, and objective analytics structures.")
public class GoalController {

    private final GoalService goalService;

    @GetMapping
public ResponseEntity<List<GoalResponse>> getAllGoals(
        @AuthenticationPrincipal String userId
) {
    List<GoalResponse> responses =
            goalService.getAllGoals(UUID.fromString(userId));

    return ResponseEntity.ok(responses);
}

    @PostMapping
    @Operation(summary = "Initialize a targeted goal container", description = "Provisions a long-range objective row mapped strictly onto the tracking context of the calling user.")
    public ResponseEntity<GoalResponse> createGoal(
            @Valid @RequestBody CreateGoalRequest request,
            @AuthenticationPrincipal String userId
    ) {
        System.out.println("USER ID = " + userId);
System.out.println("REQUEST = " + request);
        log.info("API Post Ingress: Capturing objective creation request tracking metrics for customer context: {}", userId);
        System.out.println("GOAL CONTROLLER HIT");
        GoalResponse response = goalService.createGoal(request, UUID.fromString(userId));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Examine a clear goal tracking configuration row", description = "Returns foundational structural metadata criteria if target parameters map securely to the user signature.")
    public ResponseEntity<GoalResponse> getGoal(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Get Ingress: Processing item level single target verification lookups on identity key: {}", id);
        GoalResponse response = goalService.getGoal(id, UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modify objectives properties, deadlines, or incremental metrics", description = "Pushes localized updates into the target element records block if permission mappings resolve successfully.")
    public ResponseEntity<GoalResponse> updateGoal(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateGoalRequest request,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Put Ingress: Handshaking programmatic updates down to persistence records node: {}", id);
        
        GoalResponse response = goalService.updateGoal(id, request, UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Wipe an objective sequence row out of persistent scopes", description = "Deletes tracking allocations permanently from database records data segments.")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Delete Ingress: Invoking resource validation and removal procedures on element key: {}", id);
        goalService.deleteGoal(id, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }
}