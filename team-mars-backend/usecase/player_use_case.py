"""
Player Use Case Module.
This module contains business logic for Player operations.
Sits between the API layer (controllers) and the persistence layer (repositories).
"""

from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from repository.player_repository import PlayerRepository
from core.exceptions import NotFoundException, ConflictException
from model.player.player import (
    PlayerCreate,
    PlayerUpdate,
    PlayerSimple,
    PlayerFull,
)


class PlayerUseCase:
    """
    Encapsulates business logic for Player operations.
    Acts as the intermediary between API controllers and player repository layer.
    """

    def __init__(self, repo: PlayerRepository):
        self.repo = repo

    # CREATE A PLAYER
    async def create_player(
        self, session: AsyncSession, payload: PlayerCreate
    ) -> PlayerSimple:
        """
        Create a new player with business rule validation.
        """
        # Business Rule: Jersey number must be non-negative
        if payload.jersey_number is not None and payload.jersey_number < 0:
            raise ValueError("Jersey number must be a non-negative number.")

        # TODO: Add business rule - Check for duplicate jersey numbers within a team
        # TODO: Add business rule - Validate roster limits per team
        # TODO: Add business rule - Validate position against allowed positions

        player = await self.repo.create_player(session, payload)
        return PlayerSimple.model_validate(player)

    # GET ALL PLAYERS
    async def list_players(
        self, session: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[PlayerSimple]:
        """
        List all players with pagination.
        """
        # TODO: Add business rule - Filter by team
        # TODO: Add business rule - Filter by position
        # TODO: Add business rule - Filter by skill level
        # TODO: Add business rule - Sort by name, jersey number, etc.

        players = await self.repo.list_players(session, skip=skip, limit=limit)
        return [PlayerSimple.model_validate(p) for p in players]

    # GET PLAYER BY ID (SIMPLE)
    async def get_player_by_id(
        self, session: AsyncSession, player_id: UUID
    ) -> PlayerSimple:
        """
        Get a player by ID (simple view without relationships).
        """
        player = await self.repo.get_player_by_id(session, player_id)
        if not player:
            raise NotFoundException("Player not found.")
        return PlayerSimple.model_validate(player)

    # GET PLAYER BY ID (FULL WITH RELATIONSHIPS)
    async def get_player_full(
        self, session: AsyncSession, player_id: UUID
    ) -> PlayerFull:
        """
        Get a player by ID with all relationships loaded.
        """
        player = await self.repo.get_player_with_relationships(session, player_id)
        if not player:
            raise NotFoundException("Player not found.")
        return PlayerFull.model_validate(player)

    # UPDATE PLAYER
    async def update_player(
        self, session: AsyncSession, player_id: UUID, payload: PlayerUpdate
    ) -> PlayerSimple:
        """
        Update an existing player with business rule validation.
        """
        # Business Rule: Jersey number must be non-negative
        if payload.jersey_number is not None and payload.jersey_number < 0:
            raise ValueError("Jersey number must be a non-negative number.")

        # Check if player exists
        player = await self.repo.get_player_by_id(session, player_id)
        if not player:
            raise NotFoundException("Player not found.")

        # TODO: Add business rule - Check for duplicate jersey numbers within a team
        # TODO: Add business rule - Prevent updates if player is in active match
        # TODO: Add business rule - Validate position changes

        updated = await self.repo.update_player(session, player_id, payload)
        return PlayerSimple.model_validate(updated)

    # DELETE PLAYER
    async def delete_player(self, session: AsyncSession, player_id: UUID) -> None:
        """
        Delete a player by ID.
        """
        # Check if player exists
        player = await self.repo.get_player_by_id(session, player_id)
        if not player:
            raise NotFoundException("Player not found.")

        # TODO: Add business rule - Prevent deletion if player has match history
        # TODO: Add business rule - Soft delete instead of hard delete
        # TODO: Add business rule - Archive player data before deletion

        await self.repo.delete_player(session, player_id)
