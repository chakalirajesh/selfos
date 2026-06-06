package com.selfos.modules.notes.service;

import com.selfos.modules.notes.dto.*;
import java.util.List;
import java.util.UUID;

public interface NoteService {
    NoteResponse createNote(CreateNoteRequest request, UUID userId);
    List<NoteResponse> getAllNotes(UUID userId);
    NoteResponse getNote(UUID id, UUID userId);
    NoteResponse updateNote(UUID id, UpdateNoteRequest request, UUID userId);
    void deleteNote(UUID id, UUID userId);
}