package com.selfos.modules.goals.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "gol_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "goal_name", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "target_date", nullable = false)
    private OffsetDateTime targetDate;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "NOT_STARTED";

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "start_date", nullable = false)
    private OffsetDateTime startDate;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "progress_percentage", nullable = false)
    @Builder.Default
    private Integer progressPercentage = 0;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "updated_by", nullable = false)
    private UUID updatedBy;

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;

        if (this.startDate == null)
            this.startDate = now;

        if (this.progressPercentage == null)
            this.progressPercentage = 0;

        if (this.status == null)
            this.status = "NOT_STARTED";
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}