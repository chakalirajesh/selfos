package com.selfos.modules.notes.controller;

import com.selfos.modules.notes.dto.*;
import com.selfos.modules.notes.service.NoteService;
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
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Notes Management Module", description = "Endpoints processing secure multi-tenant personal markdown notes and documentation data matrix stores.")
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    @Operation(summary = "Create a new notes document row", description = "Generates an isolated text document node assigned explicitly to the active verified security principal context.")
    public ResponseEntity<NoteResponse> createNote(
            @Valid @RequestBody CreateNoteRequest request,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Rest Post Ingress: Processing note generation schema mapping criteria for user context ID: {}", userId);
        NoteResponse response = noteService.createNote(request, UUID.fromString(userId));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Collect all notebook indices owned by the caller", description = "Returns an absolute data slice layer containing all historical markdown entries matching the calling user profile.")
    public ResponseEntity<List<NoteResponse>> getAllNotes(@AuthenticationPrincipal String userId) {
        log.info("API Rest Get Ingress: Executing bulk lookup compilation records array slice for user ID: {}", userId);
        List<NoteResponse> responses = noteService.getAllNotes(UUID.fromString(userId));
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Fetch a target documentation segment", description = "Returns the structural string body content of a note if the caller passes verification and ownership checks.")
    public ResponseEntity<NoteResponse> getNote(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Rest Get Ingress: Processing specific data node query parameters for entity footprint index: {}", id);
        NoteResponse response = noteService.getNote(id, UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modify title or raw body contents of a note", description = "Overwrites specific text data allocations if the record identity matches structural boundaries cleanly.")
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateNoteRequest request,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Rest Put Ingress: Committing modifications on notebook data row element: {}", id);
        NoteResponse response = noteService.updateNote(id, request, UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Permanently eliminate a document footprint row", description = "Drops the document entry from persistence scopes if security clearance parameters validate the request.")
    public ResponseEntity<Void> deleteNote(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId
    ) {
        log.info("API Rest Delete Ingress: Invoking hard structural cleanup routines on element database index: {}", id);
        noteService.deleteNote(id, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }
}