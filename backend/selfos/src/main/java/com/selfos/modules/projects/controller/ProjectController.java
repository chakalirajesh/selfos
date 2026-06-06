package com.selfos.modules.projects.controller;

import com.selfos.modules.projects.dto.*;
import com.selfos.modules.projects.service.ProjectService;
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
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Project Management Module", description = "Endpoints providing complete isolated CRUD tracking operations for SelfOS top-level projects.")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @Operation(summary = "Create a new project entity record", description = "Generates a clean project workspace bound strictly to the calling authenticated tenant context identity.")
   public ResponseEntity<ProjectResponse> createProject(
        @Valid @RequestBody CreateProjectRequest request,
        @AuthenticationPrincipal String userId
    ) {

        System.out.println("USER ID = " + userId);

        System.out.println("CONTROLLER HIT");
        System.out.println("USER ID = " + userId);

        log.info("API Post Ingress: Intercepted project initialization payload request by user {}", userId);

        ProjectResponse response =
                projectService.createProject(
                        request,
                        UUID.fromString(userId)
                );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @SuppressWarnings("unused")
    @GetMapping
    @Operation(summary = "Retrieve all contextual projects belonging to the active user", description = "Returns an absolute collection arrays slice restricted strictly to the caller's unique ID scope.")
    public ResponseEntity<List<ProjectResponse>> getAllProjects(
            @AuthenticationPrincipal String userId) {

        List<ProjectResponse> responses =
                projectService.getAllProjects(UUID.fromString(userId));

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Fetch a precise project workspace context using its unique ID", description = "Extracts structural element details if the identifier matches an entity instance owned by the caller.")
    public ResponseEntity<ProjectResponse> getProject(
        @PathVariable UUID id,
        @AuthenticationPrincipal String userId
    ) {
        ProjectResponse response = projectService.getProject(id, UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modify status, metadata or state fields on an existing project", description = "Updates localized metadata records directly if ownership constraints are validated cleanly.")
    public ResponseEntity<ProjectResponse> updateProject(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateProjectRequest request,
        @AuthenticationPrincipal String userId
    ) {
        ProjectResponse response =
                projectService.updateProject(
                        id,
                        request,
                        UUID.fromString(userId)
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Completely remove a project instance from persistence scopes", description = "Performs a secure data cascade removal on the target data block if the execution token context matches ownership parameters.")
    public ResponseEntity<Void> deleteProject(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Delete Ingress: Triggering permanent entity record elimination routine on database item: {}", id);

        projectService.deleteProject(
                id,
                 UUID.fromString(userId)
        );
        return ResponseEntity.noContent().build();
    }
}