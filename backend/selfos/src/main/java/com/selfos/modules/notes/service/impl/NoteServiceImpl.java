package com.selfos.modules.notes.service.impl;

import com.selfos.core.exception.ResourceNotFoundException;
import com.selfos.modules.notes.dto.*;
import com.selfos.modules.notes.entity.NoteEntity;
import com.selfos.modules.notes.repository.NoteRepository;
import com.selfos.modules.notes.service.NoteService;
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
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public NoteResponse createNote(CreateNoteRequest request, UUID userId) {
        log.info("Creating a new notebook entry under title '{}' for user ID: {}", request.getTitle(), userId);

        NoteEntity entity = NoteEntity.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .userId(userId)
                .build();

        NoteEntity savedEntity = noteRepository.save(entity);
        return mapToResponse(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotes(UUID userId) {
        log.info("Fetching all personal notebook data collections belonging to user ID: {}", userId);
        return noteRepository.findAllByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public NoteResponse getNote(UUID id, UUID userId) {
        log.info("Requesting read operations for note key: {} under user context: {}", id, userId);
        NoteEntity entity = noteRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Requested notebook entry not found or permission denied."));
        return mapToResponse(entity);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public NoteResponse updateNote(UUID id, UpdateNoteRequest request, UUID userId) {
        log.info("Applying programmatic string state mutations to target note ID: {}", id);

        NoteEntity entity = noteRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Target notebook entry could not be located to perform adjustments."));

        entity.setTitle(request.getTitle());
        entity.setContent(request.getContent());

        NoteEntity updatedEntity = noteRepository.save(entity);
        return mapToResponse(updatedEntity);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteNote(UUID id, UUID userId) {
        log.info("Requesting immediate permanent deletion execution sequence on note trace entity: {}", id);
        NoteEntity entity = noteRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Target notebook item matching criteria could not be located."));
        
        noteRepository.delete(entity);
    }

    private NoteResponse mapToResponse(NoteEntity entity) {
        return NoteResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .userId(entity.getUserId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}