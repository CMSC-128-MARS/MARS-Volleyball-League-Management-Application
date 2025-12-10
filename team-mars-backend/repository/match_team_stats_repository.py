"""
Match Team Stats Repository Module.
This module provides data access layer for Match Team Stats entities.
All methods return SQLAlchemy models, not Pydantic schemas.
"""

from typing import List, Optional
from uuid import UUID
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from repository.models.match_team_stats import MatchTeamStats
from model.match_team_stats.match_team_stats import (
    MatchTeamStatsCreate,
    MatchTeamStatsUpdate,
    MatchResultsSummary,
)


class MatchTeamStatsRepository:
    """Async repository layer for Match Team Stats model."""

    # CREATE MATCH TEAM STATS
    async def create_match_team_stats(
        self, db: AsyncSession, data: MatchTeamStatsCreate
    ) -> MatchTeamStats:
        """Create new match team stats entry"""
        match_team_stats = MatchTeamStats(**data.model_dump())
        db.add(match_team_stats)
        await db.commit()
        await db.refresh(match_team_stats)
        return match_team_stats

    # GET MATCH TEAM STATS BY ID
    async def get_match_team_stats_by_id(
        self, db: AsyncSession, match_team_stats_id: UUID
    ) -> Optional[MatchTeamStats]:
        """Get match team stats by ID without relationships"""
        result = await db.execute(
            select(MatchTeamStats).where(
                MatchTeamStats.match_team_stats_id == match_team_stats_id
            )
        )
        return result.scalars().first()

    # GET MATCH TEAM STATS WITH RELATIONSHIPS
    async def get_match_team_stats_with_relationships(
        self, db: AsyncSession, match_team_stats_id: UUID
    ) -> Optional[MatchTeamStats]:
        """Get match team stats by ID with match and team relationships"""
        result = await db.execute(
            select(MatchTeamStats)
            .options(
                selectinload(MatchTeamStats.match),
                selectinload(MatchTeamStats.team),
            )
            .where(MatchTeamStats.match_team_stats_id == match_team_stats_id)
        )
        return result.scalars().first()

    # LIST ALL MATCH TEAM STATS
    async def list_match_team_stats(
        self, db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[MatchTeamStats]:
        """List all match team stats with relationships"""
        result = await db.execute(
            select(MatchTeamStats)
            .options(
                selectinload(MatchTeamStats.match),
                selectinload(MatchTeamStats.team),
            )
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().unique().all()

    # GET MATCH TEAM STATS BY MATCH ID
    async def get_match_team_stats_by_match(
        self, db: AsyncSession, match_id: UUID
    ) -> List[MatchTeamStats]:
        """Get all match team stats for a specific match"""
        result = await db.execute(
            select(MatchTeamStats)
            .options(
                selectinload(MatchTeamStats.team),
                selectinload(MatchTeamStats.match),
            )
            .where(MatchTeamStats.match_id == match_id)
        )
        return result.scalars().unique().all()

    # GET MATCH TEAM STATS BY TEAM ID
    async def get_match_team_stats_by_team(
        self, db: AsyncSession, team_id: UUID
    ) -> List[MatchTeamStats]:
        """Get all match team stats for a specific team"""
        result = await db.execute(
            select(MatchTeamStats)
            .options(
                selectinload(MatchTeamStats.match),
            )
            .where(MatchTeamStats.team_id == team_id)
        )
        return result.scalars().unique().all()

    # UPDATE MATCH TEAM STATS
    async def update_match_team_stats(
        self, db: AsyncSession, match_team_stats_id: UUID, data: MatchTeamStatsUpdate
    ) -> Optional[MatchTeamStats]:
        """Update match team stats by ID"""
        match_team_stats = await self.get_match_team_stats_by_id(
            db, match_team_stats_id
        )
        if not match_team_stats:
            return None

        update_fields = data.model_dump(exclude_unset=True)
        for key, value in update_fields.items():
            setattr(match_team_stats, key, value)

        await db.commit()
        await db.refresh(match_team_stats)
        return match_team_stats

    # DELETE MATCH TEAM STATS
    async def delete_match_team_stats(
        self, db: AsyncSession, match_team_stats_id: UUID
    ) -> bool:
        """Delete match team stats by ID"""
        match_team_stats = await self.get_match_team_stats_by_id(
            db, match_team_stats_id
        )
        if not match_team_stats:
            return False

        await db.delete(match_team_stats)
        await db.commit()
        return True

    # CHECK IF STATS EXIST FOR MATCH AND TEAM
    async def get_stats_by_match_and_team(
        self, db: AsyncSession, match_id: UUID, team_id: UUID
    ) -> Optional[MatchTeamStats]:
        """Get stats for a specific match and team combination"""
        result = await db.execute(
            select(MatchTeamStats).where(
                and_(
                    MatchTeamStats.match_id == match_id,
                    MatchTeamStats.team_id == team_id,
                )
            )
        )
        return result.scalars().first()

    # GET MATCH RESULTS SUMMARY
    async def get_match_results(
        self, db: AsyncSession, match_id: UUID
    ) -> Optional[MatchResultsSummary]:
        """Get formatted match results with both teams' stats"""
        result = await db.execute(
            select(MatchTeamStats)
            .options(selectinload(MatchTeamStats.team))
            .where(MatchTeamStats.match_id == match_id)
            .order_by(MatchTeamStats.is_winner.desc().nullslast())
        )
        teams_stats = result.scalars().all()

        if len(teams_stats) != 2:
            return None

        team1, team2 = teams_stats[0], teams_stats[1]

        return {
            "final_scores": {
                "team1_name": team1.team.team_name,
                "team1_total_score": team1.total_score or 0,
                "team2_name": team2.team.team_name,
                "team2_total_score": team2.total_score or 0,
            },
            "final_sets": {
                "team1_sets_won": team1.sets_won or 0,
                "team2_sets_won": team2.sets_won or 0,
            },
        }
