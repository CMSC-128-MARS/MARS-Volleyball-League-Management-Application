"""
Player Controller Module.
This module contains FastAPI routes for Player operations.
All business logic is delegated to the PlayerUseCase layer.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List
from model.player.player import (
    PlayerCreate,
    PlayerUpdate,
    PlayerSimple,
    PlayerFull,
)
from usecase.player_use_case import PlayerUseCase
from repository.database import get_async_session
from repository.player_repository import PlayerRepository

router = APIRouter(prefix="/players", tags=["Players"])


def get_player_use_case() -> PlayerUseCase:
    """Dependency injection for PlayerUseCase."""
    player_repo = PlayerRepository()
    return PlayerUseCase(repo=player_repo)


@router.post("/", response_model=PlayerSimple, status_code=status.HTTP_201_CREATED)
async def create_player(
    payload: PlayerCreate,
    session: AsyncSession = Depends(get_async_session),
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """Create a new player."""
    return await use_case.create_player(session, payload)


@router.get("/", response_model=List[PlayerSimple])
async def list_players(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_async_session),
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """List all players with pagination."""
    return await use_case.list_players(session, skip=skip, limit=limit)


@router.get("/{player_id}", response_model=PlayerSimple)
async def get_player(
    player_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """Get a player by ID (simple view)."""
    return await use_case.get_player_by_id(session, player_id)


@router.get("/{player_id}/full", response_model=PlayerFull)
async def get_player_full(
    player_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """Get a player by ID with all relationships."""
    return await use_case.get_player_full(session, player_id)


@router.put("/{player_id}", response_model=PlayerSimple)
async def update_player(
    player_id: UUID,
    payload: PlayerUpdate,
    session: AsyncSession = Depends(get_async_session),
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """Update an existing player."""
    return await use_case.update_player(session, player_id, payload)


@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_player(
    player_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """Delete a player by ID."""
    await use_case.delete_player(session, player_id)
