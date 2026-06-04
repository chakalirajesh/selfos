package com.selfos.modules.auth.service;

import com.selfos.modules.auth.dto.*;

/**
 * Core authentication boundary service managing user identity lifecycles,
 * secure token distribution, and cryptographic session rotation.
 */
public interface AuthenticationService {

    /**
     * Registers a new user within the system, hashes credentials, and provisions active session tokens.
     * @param request Validated user registration details.
     * @return Transferred structural security authorization data.
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Validates inbound login credentials and establishes a rotated session footprint.
     * @param request Cleartext matching criteria credentials.
     * @return Dynamic network access and verification payload wrapper.
     */
    AuthResponse login(LoginRequest request);

    /**
     * Implements single-use Refresh Token Rotation (RTR) to safely exchange an active 
     * refresh token for a brand new token pair.
     * @param request Holder wrapper containing the active token string.
     * @return Newly generated access and refresh criteria.
     */
    AuthResponse refreshToken(RefreshRequest request);

    /**
     * Revokes active authorization records from persistence levels to invalidate user sessions.
     * @param refreshToken The raw refresh token target assigned to be destroyed.
     */
    void logout(String refreshToken);
}