"""
Team Player Controller Module.
This module contains FastAPI routes for TeamPlayer operations.
All business logic is delegated to the TeamPlayerUseCase layer.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List
from model.team_player.team_player import (
    TeamPlayerCreate,
    TeamPlayerUpdate,
    TeamPlayerSimple,
    TeamPlayerFull,
)
from usecase.team_player_use_case import TeamPlayerUseCase
from repository.database import get_async_session
from repository.team_player_repository import TeamPlayerRepository
from repository.team_repository import TeamRepository
from repository.player_repository import PlayerRepository

router = APIRouter(prefix="/team-players", tags=["Team Players"])


def get_team_player_use_case() -> TeamPlayerUseCase:
    """Dependency injection for TeamPlayerUseCase."""
    team_player_repo = TeamPlayerRepository()
    team_repo = TeamRepository()
    player_repo = PlayerRepository()
    return TeamPlayerUseCase(
        repo=team_player_repo, team_repo=team_repo, player_repo=player_repo
    )


@router.post("/", response_model=TeamPlayerSimple, status_code=status.HTTP_201_CREATED)
async def create_team_player(
    payload: TeamPlayerCreate,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamPlayerUseCase = Depends(get_team_player_use_case),
):
    """Add a player to a team."""
    return await use_case.create_team_player(session, payload)


@router.get("/", response_model=List[TeamPlayerSimple])
async def list_team_players(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamPlayerUseCase = Depends(get_team_player_use_case),
):
    """List all team players with pagination."""
    return await use_case.list_team_players(session, skip=skip, limit=limit)


@router.get("/team/{team_id}", response_model=List[TeamPlayerSimple])
async def get_team_players_by_team(
    team_id: UUID,
    active_only: bool = False,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamPlayerUseCase = Depends(get_team_player_use_case),
):
    """Get all players on a specific team."""
    return await use_case.get_team_players_by_team(session, team_id, active_only)


@router.get("/player/{player_id}", response_model=List[TeamPlayerSimple])
async def get_team_players_by_player(
    player_id: UUID,
    active_only: bool = False,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamPlayerUseCase = Depends(get_team_player_use_case),
):
    """Get all teams a specific player is/was on."""
    return await use_case.get_team_players_by_player(session, player_id, active_only)


@router.get("/{team_player_id}", response_model=TeamPlayerSimple)
async def get_team_player(
    team_player_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamPlayerUseCase = Depends(get_team_player_use_case),
):
    """Get a team player by ID (simple view)."""
    return await use_case.get_team_player_by_id(session, team_player_id)


@router.get("/{team_player_id}/full", response_model=TeamPlayerFull)
async def get_team_player_full(
    team_player_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamPlayerUseCase = Depends(get_team_player_use_case),
):
    """Get a team player by ID with all relationships."""
    return await use_case.get_team_player_full(session, team_player_id)


@router.put("/{team_player_id}", response_model=TeamPlayerSimple)
async def update_team_player(
    team_player_id: UUID,
    payload: TeamPlayerUpdate,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamPlayerUseCase = Depends(get_team_player_use_case),
):
    """Update an existing team player."""
    return await use_case.update_team_player(session, team_player_id, payload)


@router.delete("/{team_player_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team_player(
    team_player_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamPlayerUseCase = Depends(get_team_player_use_case),
):
    """Delete a team player by ID (hard delete)."""
    await use_case.delete_team_player(session, team_player_id)


@router.post("/{team_player_id}/remove", response_model=TeamPlayerSimple)
async def remove_player_from_team(
    team_player_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamPlayerUseCase = Depends(get_team_player_use_case),
):
    """Remove a player from a team by setting leave_date (soft delete)."""
    return await use_case.remove_player_from_team(session, team_player_id)
