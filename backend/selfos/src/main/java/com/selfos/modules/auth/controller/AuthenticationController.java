package com.selfos.modules.auth.controller;

import com.selfos.modules.auth.dto.*;
import com.selfos.modules.auth.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication Management Module", description = "Endpoints for handling user lifecycles, cryptographic credentials verification, and session token rotation.")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user identity profile", description = "Creates a new user record with securely hashed credentials and grants immediate session privileges.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User registration finalized successfully and identity tokens distributed."),
        @ApiResponse(responseCode = "400", description = "Invalid request payload parameters or email address domain uniqueness clash.")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("REST Ingress: Intercepted profile enrollment request for profile identity target: {}", request.getEmail());
        AuthResponse response = authenticationService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user credentials", description = "Validates plain-text credentials using a secure password-matching challenge and provisions unique JWT token sets.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Identity verified successfully and crypto tokens provisioned."),
        @ApiResponse(responseCode = "400", description = "Invalid request payload layout syntax format structure."),
        @ApiResponse(responseCode = "401", description = "The provided credentials profile information matching criteria failed validation.")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("REST Ingress: Processing authorization challenge matching sequence for target identifier: {}", request.getEmail());
        AuthResponse response = authenticationService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Execute single-use Refresh Token Rotation (RTR)", description = "Exchanges a non-expired refresh token for an entirely new, updated access/refresh token pair.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Session reference token updated and security criteria rotated successfully."),
        @ApiResponse(responseCode = "400", description = "The explicit validation checks on the target request authorization token failed or token reuse was flagged.")
    })
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        log.info("REST Ingress: Processing structural session extraction sequence on verification parameters.");
        AuthResponse response = authenticationService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke active token profile session metrics", description = "Explicitly targets and invalidates the active refresh token pool data records linked to the user context session.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Session trace tokens dropped from persistent data boundaries successfully."),
        @ApiResponse(responseCode = "400", description = "Empty or malformed token validation wrapper target context.")
    })
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest request) {
        log.info("REST Ingress: Initiating explicit security state revocation sequence maps.");
        authenticationService.logout(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }
}