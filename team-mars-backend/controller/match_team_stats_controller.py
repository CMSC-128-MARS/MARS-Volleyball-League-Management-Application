"""
Match Team Stats API Router
FastAPI endpoints for Match Team Stats operations
"""

from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from repository.match_team_stats_repository import MatchTeamStatsRepository
from repository.database import get_async_session

from usecase.match_team_stats_use_case import MatchTeamStatsUseCase
from model.match_team_stats.match_team_stats import (
    MatchTeamStatsCreate,
    MatchTeamStatsUpdate,
    MatchTeamStatsSimple,
    MatchTeamStatsFull,
    MatchResultsSummary,
    MatchResultsUpdate,
)

router = APIRouter(prefix="/match-stats", tags=["Match Team Stats"])


def get_match_team_stats_use_case() -> MatchTeamStatsUseCase:
    repo = MatchTeamStatsRepository()
    return MatchTeamStatsUseCase(repo=repo)


@router.post(
    "/",
    response_model=MatchTeamStatsSimple,
    status_code=status.HTTP_201_CREATED,
    summary="Create Match Team Stats",
)
async def create_match_team_stats(
    payload: MatchTeamStatsCreate,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Create new match team stats entry"""
    return await use_case.create_match_team_stats(session, payload)


@router.get(
    "/", response_model=List[MatchTeamStatsFull], summary="List All Match Team Stats"
)
async def list_match_team_stats(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """List all match team stats with pagination"""
    return await use_case.list_match_team_stats(session, skip, limit)


@router.get(
    "/{match_team_stats_id}",
    response_model=MatchTeamStatsFull,
    summary="Get Match Team Stats by ID",
)
async def get_match_team_stats_by_id(
    match_team_stats_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Get match team stats by ID with relationships"""
    return await use_case.get_match_team_stats_by_id(session, match_team_stats_id)


@router.get(
    "/match/{match_id}",
    response_model=List[MatchTeamStatsFull],
    summary="Get Match Team Stats by Match ID",
)
async def get_match_team_stats_by_match(
    match_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Get all match team stats for a specific match"""
    return await use_case.get_match_team_stats_by_match(session, match_id)


@router.get(
    "/team/{team_id}",
    response_model=List[MatchTeamStatsFull],
    summary="Get Match Team Stats by Team ID",
)
async def get_match_team_stats_by_team(
    team_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Get all match team stats for a specific team"""
    return await use_case.get_match_team_stats_by_team(session, team_id)


@router.put(
    "/{match_team_stats_id}",
    response_model=MatchTeamStatsSimple,
    summary="Update Match Team Stats",
)
async def update_match_team_stats(
    match_team_stats_id: UUID,
    payload: MatchTeamStatsUpdate,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Update match team stats by ID"""
    return await use_case.update_match_team_stats(session, match_team_stats_id, payload)


@router.delete(
    "/{match_team_stats_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Match Team Stats",
)
async def delete_match_team_stats(
    match_team_stats_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """Delete match team stats by ID"""
    await use_case.delete_match_team_stats(session, match_team_stats_id)


@router.get(
    "/matches/{match_id}/results",
    response_model=MatchResultsSummary,
    summary="Get Match Results Summary",
    description="Get formatted match results with both teams' final scores and sets",
)
async def get_match_results(
    match_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """
    Get match results summary for both teams.

    Returns final scores and sets for both teams in a formatted structure.
    The match must have exactly 2 teams with stats.
    """
    return await use_case.get_match_results(session, match_id)


@router.put(
    "/matches/{match_id}/results",
    response_model=MatchResultsSummary,
    summary="Update Match Results",
    description="Update match results for both teams in a single request",
)
async def update_match_results(
    match_id: UUID,
    payload: MatchResultsUpdate,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchTeamStatsUseCase = Depends(get_match_team_stats_use_case),
):
    """
    Update match results for both teams.

    This endpoint:
    - Updates stats for both teams in a single atomic transaction
    - Automatically determines the winner based on sets_won
    - Returns the updated match results summary

    Example payload:
    ```json
    {
      "team1_id": "uuid-here",
      "team1_stats": {
        "total_score": 28,
        "sets_won": 1,
        "sets_lost": 0
      },
      "team2_id": "uuid-here",
      "team2_stats": {
        "total_score": 25,
        "sets_won": 0,
        "sets_lost": 1
      }
    }
    ```
    """
    return await use_case.update_match_results(session, match_id, payload)
