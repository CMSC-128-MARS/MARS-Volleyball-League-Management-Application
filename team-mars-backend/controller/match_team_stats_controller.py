"""
Match Team Stats Controller Module.

This module contains FastAPI routes for Match Team Stats operations.
All business logic is delegated to the MatchTeamStatsUseCase layer.
"""

from fastapi import APIRouter, status, Depends
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from model.match_team_stats.match_team_stats import (
    MatchTeamStatsCreate,
    MatchTeamStatsUpdate,
    MatchTeamStatsSimple,
    MatchTeamStatsFull,
)
from usecase.match_team_stats_use_case import MatchTeamStatsUseCase
from repository.match_team_stats_repository import MatchTeamStatsRepository
from repository.database import get_async_session

router = APIRouter(prefix="/match-team-stats", tags=["Match Team Stats"])

"""
Dependency Injection
"""


def get_match_team_stats_repo() -> MatchTeamStatsRepository:
    """Dependency to get Match Team Stats Repository"""
    return MatchTeamStatsRepository()


def get_match_team_stats_use_case(
    repo: MatchTeamStatsRepository = Depends(get_match_team_stats_repo),
) -> MatchTeamStatsUseCase:
    """Dependency to get Match Team Stats use case"""
    return MatchTeamStatsUseCase(repo=repo)


"""
CREATE MATCH TEAM STATS
"""


@router.post(
    "",
    response_model=MatchTeamStatsSimple,
    status_code=status.HTTP_201_CREATED,
)
async def create_match_team_stats(
    payload: MatchTeamStatsCreate,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Create new match team stats entry"""
    return await use_case.create_match_team_stats(session, payload)


"""
READ - GET ALL MATCH TEAM STATS
"""


@router.get(
    "",
    response_model=List[MatchTeamStatsFull],
    status_code=status.HTTP_200_OK,
)
async def list_match_team_stats(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """List all match team stats with pagination"""
    return await use_case.list_match_team_stats(session, skip, limit)


"""
READ - GET MATCH TEAM STATS BY ID
"""


@router.get(
    "/{match_team_stats_id}",
    response_model=MatchTeamStatsFull,
    status_code=status.HTTP_200_OK,
)
async def get_match_team_stats_by_id(
    match_team_stats_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Get match team stats by ID"""
    return await use_case.get_match_team_stats_by_id(session, match_team_stats_id)


"""
READ - GET MATCH TEAM STATS BY MATCH ID
"""


@router.get(
    "/match/{match_id}",
    response_model=List[MatchTeamStatsFull],
    status_code=status.HTTP_200_OK,
)
async def get_match_team_stats_by_match(
    match_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Get all match team stats for a specific match"""
    return await use_case.get_match_team_stats_by_match(session, match_id)


"""
READ - GET MATCH TEAM STATS BY TEAM ID
"""


@router.get(
    "/team/{team_id}",
    response_model=List[MatchTeamStatsFull],
    status_code=status.HTTP_200_OK,
)
async def get_match_team_stats_by_team(
    team_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Get all match team stats for a specific team"""
    return await use_case.get_match_team_stats_by_team(session, team_id)


"""
UPDATE MATCH TEAM STATS BY ID
"""


@router.put(
    "/{match_team_stats_id}",
    response_model=MatchTeamStatsSimple,
    status_code=status.HTTP_200_OK,
)
async def update_match_team_stats(
    match_team_stats_id: UUID,
    payload: MatchTeamStatsUpdate,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Update match team stats by ID"""
    return await use_case.update_match_team_stats(session, match_team_stats_id, payload)


"""
DELETE MATCH TEAM STATS BY ID
"""


@router.delete(
    "/{match_team_stats_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_match_team_stats(
    match_team_stats_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Delete match team stats by ID"""
    return await use_case.delete_match_team_stats(session, match_team_stats_id)
