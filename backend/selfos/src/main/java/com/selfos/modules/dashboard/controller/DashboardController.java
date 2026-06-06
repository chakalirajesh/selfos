package com.selfos.modules.dashboard.controller;

import com.selfos.modules.dashboard.dto.DashboardResponse;
import com.selfos.modules.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(
            @AuthenticationPrincipal String userId
    ) {

        return ResponseEntity.ok(
                dashboardService.getDashboard(
                        UUID.fromString(userId)
                )
        );
    }
}