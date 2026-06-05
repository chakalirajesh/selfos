package com.selfos.modules.projects.service;

import com.selfos.modules.projects.dto.*;
import java.util.List;
import java.util.UUID;

public interface ProjectService {
    ProjectResponse createProject(CreateProjectRequest request, UUID currentUserId);
    List<ProjectResponse> getAllProjects(UUID currentUserId);
    ProjectResponse getProject(UUID id, UUID currentUserId);
    ProjectResponse updateProject(UUID id, UpdateProjectRequest request, UUID currentUserId);
    void deleteProject(UUID id, UUID currentUserId);
}