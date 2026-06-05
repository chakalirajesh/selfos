package com.selfos.modules.projects.service.impl;

import com.selfos.core.exception.ResourceNotFoundException;
import com.selfos.modules.projects.dto.*;
import com.selfos.modules.projects.entity.ProjectEntity;
import com.selfos.modules.projects.repository.ProjectRepository;
import com.selfos.modules.projects.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public ProjectResponse createProject(CreateProjectRequest request, UUID currentUserId) {
        log.info("Creating a new project titled '{}' for owner ID: {}", request.getName(), currentUserId);

        ProjectEntity entity = ProjectEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .ownerId(currentUserId)
                .createdBy(currentUserId)
                .updatedBy(currentUserId)
                .build();

        log.info("Before save");

        ProjectEntity savedEntity = projectRepository.save(entity);

        log.info("After save");

        return mapToResponse(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(UUID currentUserId) {
        log.info("Fetching all tracking projects registered to owner ID: {}", currentUserId);
        return projectRepository.findAllByOwnerId(currentUserId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProject(UUID id, UUID currentUserId) {
        log.info("Retrieving project entity identity matching ID: {} for user: {}", id, currentUserId);
        ProjectEntity entity = projectRepository.findByIdAndOwnerId(id, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with the provided identifier."));
        return mapToResponse(entity);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public ProjectResponse updateProject(UUID id, UpdateProjectRequest request, UUID currentUserId) {
        log.info("Updating project attributes on entity reference ID: {} for user: {}", id, currentUserId);

        ProjectEntity entity = projectRepository.findByIdAndOwnerId(id, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found or user lacks access permissions."));

        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setProgress(request.getProgress());
        entity.setStatus(request.getStatus());
        entity.setUpdatedBy(currentUserId);

        ProjectEntity updatedEntity = projectRepository.save(entity);
        return mapToResponse(updatedEntity);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteProject(UUID id, UUID currentUserId) {
        log.info("Requesting hard purge on project structural item ID: {} by user: {}", id, currentUserId);
        ProjectEntity entity = projectRepository.findByIdAndOwnerId(id, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found or user lacks deletion permissions."));
        
        projectRepository.delete(entity);
    }

    private ProjectResponse mapToResponse(ProjectEntity entity) {
        return ProjectResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .ownerId(entity.getOwnerId())
                .progress(entity.getProgress())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}