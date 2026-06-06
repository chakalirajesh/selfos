package com.selfos.modules.notes.repository;

import com.selfos.modules.notes.entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<NoteEntity, UUID> {
    
    // Limits the query results exclusively to the active tenant space
    List<NoteEntity> findAllByUserId(UUID userId);
    
    // Verifies data isolation checks during resource retrieval
    Optional<NoteEntity> findByIdAndUserId(UUID id, UUID userId);

    long countByUserId(UUID userId);
}