package com.selfos.modules.dashboard.service;

import com.selfos.modules.dashboard.dto.DashboardResponse;

import java.util.UUID;

public interface DashboardService {

    DashboardResponse getDashboard(UUID userId);
}