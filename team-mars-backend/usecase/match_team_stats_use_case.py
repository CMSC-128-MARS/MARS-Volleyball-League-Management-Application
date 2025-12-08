"""
Match Team Stats Use Case Module.
This module encapsulates business logic for Match Team Stats operations.
Acts as the intermediary between API controllers and repository layer.
"""

from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from repository.match_team_stats_repository import MatchTeamStatsRepository
from core.exceptions import NotFoundException, ConflictException
from constants.logger import logger
from model.match_team_stats.match_team_stats import (
    MatchTeamStatsCreate,
    MatchTeamStatsUpdate,
    MatchTeamStatsSimple,
    MatchTeamStatsFull,
)


class MatchTeamStatsUseCase:
    """
    Encapsulates business logic for Match Team Stats operations.
    Acts as the intermediary between API controllers and repository layer.
    """

    def __init__(self, repo: MatchTeamStatsRepository):
        self.repo = repo

    # CREATE MATCH TEAM STATS
    async def create_match_team_stats(
        self, session: AsyncSession, payload: MatchTeamStatsCreate
    ) -> MatchTeamStatsSimple:
        """Create new match team stats entry"""
        # Check if stats already exist for this match-team combination
        existing = await self.repo.get_stats_by_match_and_team(
            session, payload.match_id, payload.team_id
        )
        if existing:
            raise ConflictException(
                "Match team stats already exist for this match and team combination."
            )

        match_team_stats = await self.repo.create_match_team_stats(session, payload)
        return MatchTeamStatsSimple.model_validate(match_team_stats)

    # READ - GET ALL MATCH TEAM STATS
    async def list_match_team_stats(
        self, session: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[MatchTeamStatsFull]:
        """List all match team stats with relationships"""
        match_team_stats_list = await self.repo.list_match_team_stats(
            session, skip, limit
        )
        return [MatchTeamStatsFull.model_validate(mts) for mts in match_team_stats_list]

    # READ - GET MATCH TEAM STATS BY ID
    async def get_match_team_stats_by_id(
        self, session: AsyncSession, match_team_stats_id: UUID
    ) -> MatchTeamStatsFull:
        """Get match team stats by ID with relationships"""
        match_team_stats = await self.repo.get_match_team_stats_with_relationships(
            session, match_team_stats_id
        )
        if not match_team_stats:
            raise NotFoundException("Match team stats not found.")
        return MatchTeamStatsFull.model_validate(match_team_stats)

    # READ - GET MATCH TEAM STATS BY MATCH ID
    async def get_match_team_stats_by_match(
        self, session: AsyncSession, match_id: UUID
    ) -> List[MatchTeamStatsFull]:
        """Get all match team stats for a specific match"""
        match_team_stats_list = await self.repo.get_match_team_stats_by_match(
            session, match_id
        )
        return [MatchTeamStatsFull.model_validate(mts) for mts in match_team_stats_list]

    # READ - GET MATCH TEAM STATS BY TEAM ID
    async def get_match_team_stats_by_team(
        self, session: AsyncSession, team_id: UUID
    ) -> List[MatchTeamStatsFull]:
        """Get all match team stats for a specific team"""
        match_team_stats_list = await self.repo.get_match_team_stats_by_team(
            session, team_id
        )
        return [MatchTeamStatsFull.model_validate(mts) for mts in match_team_stats_list]

    # UPDATE MATCH TEAM STATS
    async def update_match_team_stats(
        self,
        session: AsyncSession,
        match_team_stats_id: UUID,
        payload: MatchTeamStatsUpdate,
    ) -> MatchTeamStatsSimple:
        """Update match team stats by ID"""
        match_team_stats = await self.repo.get_match_team_stats_by_id(
            session, match_team_stats_id
        )
        if not match_team_stats:
            raise NotFoundException("Match team stats not found.")

        updated = await self.repo.update_match_team_stats(
            session, match_team_stats_id, payload
        )
        return MatchTeamStatsSimple.model_validate(updated)

    # DELETE MATCH TEAM STATS
    async def delete_match_team_stats(
        self, session: AsyncSession, match_team_stats_id: UUID
    ) -> None:
        """Delete match team stats by ID"""
        match_team_stats = await self.repo.get_match_team_stats_by_id(
            session, match_team_stats_id
        )
        if not match_team_stats:
            raise NotFoundException("Match team stats not found.")

        if await self.repo.delete_match_team_stats(session, match_team_stats_id):
            logger.info(
                "Match team stats successfully deleted: %s", match_team_stats_id
            )
