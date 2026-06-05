package com.selfos.modules.projects.repository;

import com.selfos.modules.projects.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    
    // Limits reads immediately to the authenticated tenant/owner context
    List<ProjectEntity> findAllByOwnerId(UUID ownerId);
    
    // Guarantees data isolation checks during straight read access requests
    Optional<ProjectEntity> findByIdAndOwnerId(UUID id, UUID ownerId);
}