package com.selfos.modules.auth.service.impl;

import com.selfos.core.exception.BusinessException;
import com.selfos.core.exception.ResourceNotFoundException;
import com.selfos.core.security.JwtService;
import com.selfos.modules.auth.dto.*;
import com.selfos.modules.auth.entity.RefreshTokenEntity;
import com.selfos.modules.auth.entity.UserEntity;
import com.selfos.modules.auth.repository.RefreshTokenRepository;
import com.selfos.modules.auth.repository.UserRepository;
import com.selfos.modules.auth.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${application.security.jwt.refresh-token-expiration}")
    private long refreshTokenExpirationMillis;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public AuthResponse register(RegisterRequest request) {
        log.info("Processing target user registration request for identifier: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Provided email address is already bound to an active profile identity.");
        }

        UserEntity user = UserEntity.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("USER") // Force secure default baseline authority
                .build();

        UserEntity savedUser = userRepository.save(user);
        
        String accessToken = jwtService.generateAccessToken(savedUser.getId().toString(), savedUser.getEmail(), savedUser.getRole());
        String refreshToken = createAndPersistRefreshToken(savedUser.getId());

        return mapToAuthResponse(savedUser, accessToken, refreshToken);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public AuthResponse login(LoginRequest request) {
        log.info("Authenticating system credentials profile for identifier: {}", request.getEmail());

        try {
            // Let standard Spring Security infrastructure handle core validation and event logging securely
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            log.warn("Failed credentials challenge verification captured for target email: {}", request.getEmail());
            throw new BusinessException("Invalid credentials profile information matching criteria provided.");
        } catch (AuthenticationException e) {
            log.error("Internal core auth fallback error captured on interface subsystem challenge", e);
            throw new BusinessException("Authentication subsystem encountered processing failure conditions.");
        }

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Verified user details profile target structure missing."));

        // Single-session device containment: Wipe prior tokens for clean state
        refreshTokenRepository.deleteByUserId(user.getId());

        String accessToken = jwtService.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole());
        String refreshToken = createAndPersistRefreshToken(user.getId());

        return mapToAuthResponse(user, accessToken, refreshToken);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public AuthResponse refreshToken(RefreshRequest request) {
        String rawRefreshToken = request.getRefreshToken();
        
        RefreshTokenEntity tokenEntity = refreshTokenRepository.findByToken(rawRefreshToken)
                .orElseThrow(() -> new BusinessException("Provided session reference payload record not found."));

        // [Defensive Guard Block]: Check if refresh token has been reused after a prior revocation
        if (tokenEntity.isRevoked()) {
            // Breach Mitigation: Immediate cleanup of the user's entire token pool to break access chains
            refreshTokenRepository.deleteByUserId(tokenEntity.getUserId());
            log.error("CRITICAL: Replayed refresh token reuse footprint detected on user ID: [{}]. Revoking session chain.", tokenEntity.getUserId());
            throw new BusinessException("Session token authorization has been revoked due to potential reuse breach conditions.");
        }

        if (tokenEntity.getExpiryDate().isBefore(OffsetDateTime.now())) {
            refreshTokenRepository.delete(tokenEntity);
            log.info("Purged expired structural refresh token entity for user ID: {}", tokenEntity.getUserId());
            throw new BusinessException("Target request authorization token has expired. Please log in again.");
        }

        UserEntity user = userRepository.findById(tokenEntity.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Active user profile mapping context could not be located."));

        // Execute strict Token Rotation Strategy: Invalidate previous token block without hard deleting
        tokenEntity.setRevoked(true);
        refreshTokenRepository.save(tokenEntity);

        // Provision structural upgraded credentials set
        String newAccessToken = jwtService.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole());
        String newRefreshToken = createAndPersistRefreshToken(user.getId());

        return mapToAuthResponse(user, newAccessToken, newRefreshToken);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void logout(String refreshToken) {
        log.info("Processing manual termination request sequence on targeted token reference block.");
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(tokenEntity -> {
                    // Cascade cleanup removes matching records linked directly to this identity cluster space
                    refreshTokenRepository.deleteByUserId(tokenEntity.getUserId());
                    log.info("Successfully dropped contextual refresh trace bounds tracking profile index.");
                });
    }

    /**
     * Cryptographically calculates a crypto-safe random unique token and tracks state limits inside the DB.
     */
    private String createAndPersistRefreshToken(UUID userId) {
        String tokenValue = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        
        RefreshTokenEntity refreshTokenEntity = RefreshTokenEntity.builder()
                .userId(userId)
                .token(tokenValue)
                .expiryDate(OffsetDateTime.now().plusWeeks(1)) // Maps clean standard alignment rules
                .revoked(false)
                .build();
        
        refreshTokenRepository.save(refreshTokenEntity);
        return tokenValue;
    }

    private AuthResponse mapToAuthResponse(UserEntity user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}