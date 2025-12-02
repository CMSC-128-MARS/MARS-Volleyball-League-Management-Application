"""
Player Controller Module.

This module contains FastAPI routes for Player operations.
All business logic is delegated to the PlayerUseCase layer.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import List

from model.player.player import (
    PlayerCreate,
    PlayerUpdate,
    PlayerSimple,
    PlayerFull,
)
from usecase.player_use_case import PlayerUseCase
from utils.db import get_db
from repository.player_repository import PlayerRepository
from sqlalchemy.orm import Session

router = APIRouter(prefix="/players", tags=["Players"])


def get_player_use_case(db: Session = Depends(get_db)) -> PlayerUseCase:
    """
    Dependency injection for PlayerUseCase.

    :param db: Database session
    :type db: Session
    :return: PlayerUseCase instance
    :rtype: PlayerUseCase
    """
    player_repo = PlayerRepository(db)
    return PlayerUseCase(player_repo)


@router.post("/", response_model=PlayerSimple, status_code=status.HTTP_201_CREATED)
def create_player(
    data: PlayerCreate,
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """
    Create a new player.

    :param data: Player creation data
    :type data: PlayerCreate
    :param use_case: Player use case instance
    :type use_case: PlayerUseCase
    :return: Created player
    :rtype: PlayerSimple
    :raises HTTPException: If validation fails
    """
    try:
        return use_case.create_player(data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create player: {str(e)}",
        )


@router.get("/{player_id}", response_model=PlayerSimple)
def get_player(
    player_id: UUID,
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """
    Retrieve a player by ID (simple version without relationships).

    :param player_id: Player's unique identifier
    :type player_id: UUID
    :param use_case: Player use case instance
    :type use_case: PlayerUseCase
    :return: Player information
    :rtype: PlayerSimple
    :raises HTTPException: If player not found
    """
    player = use_case.get_player_simple(player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Player not found"
        )
    return player


@router.get("/{player_id}/full", response_model=PlayerFull)
def get_player_full(
    player_id: UUID,
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """
    Retrieve a player by ID with all relationships (skills, team memberships).

    :param player_id: Player's unique identifier
    :type player_id: UUID
    :param use_case: Player use case instance
    :type use_case: PlayerUseCase
    :return: Player information with relationships
    :rtype: PlayerFull
    :raises HTTPException: If player not found
    """
    player = use_case.get_player_full(player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Player not found"
        )
    return player


@router.get("/", response_model=List[PlayerSimple])
def list_players(
    skip: int = 0,
    limit: int = 100,
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """
    Retrieve a list of players with pagination.

    :param skip: Number of records to skip
    :type skip: int
    :param limit: Maximum number of records to return
    :type limit: int
    :param use_case: Player use case instance
    :type use_case: PlayerUseCase
    :return: List of players
    :rtype: List[PlayerSimple]
    """
    return use_case.list_players(skip=skip, limit=limit)


@router.put("/{player_id}", response_model=PlayerSimple)
def update_player(
    player_id: UUID,
    data: PlayerUpdate,
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """
    Update an existing player's information.

    :param player_id: Player's unique identifier
    :type player_id: UUID
    :param data: Player update data
    :type data: PlayerUpdate
    :param use_case: Player use case instance
    :type use_case: PlayerUseCase
    :return: Updated player information
    :rtype: PlayerSimple
    :raises HTTPException: If player not found or validation fails
    """
    try:
        updated = use_case.update_player(player_id, data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Player not found"
            )
        return updated
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update player: {str(e)}",
        )


@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(
    player_id: UUID,
    use_case: PlayerUseCase = Depends(get_player_use_case),
):
    """
    Delete a player from the system.

    :param player_id: Player's unique identifier
    :type player_id: UUID
    :param use_case: Player use case instance
    :type use_case: PlayerUseCase
    :raises HTTPException: If player not found
    """
    success = use_case.delete_player(player_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Player not found"
        )
