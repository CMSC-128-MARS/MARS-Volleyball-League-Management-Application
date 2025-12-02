"""
Player Use Case Module.

This module contains business logic for Player operations.
Sits between the API layer (controllers) and the persistence layer (repositories).
"""

from uuid import UUID
from typing import List, Optional
from repository.player_repository import PlayerRepository
from model.player.player import (
    PlayerCreate,
    PlayerUpdate,
    PlayerSimple,
    PlayerFull,
)


class PlayerUseCase:
    def __init__(self, player_repo: PlayerRepository):
        self.player_repo = player_repo

    # -------------------------------------------------
    # CREATE PLAYER
    # -------------------------------------------------
    def create_player(self, data: PlayerCreate) -> PlayerSimple:
        # Business Rule: Jersey number must be non-negative
        if data.jersey_number is not None and data.jersey_number < 0:
            raise ValueError("Jersey number must be a non-negative number.")

        # TODO: Add business rule - Check for duplicate jersey numbers within a team
        # TODO: Add business rule - Validate roster limits per team
        # TODO: Add business rule - Validate position against allowed positions

        player = self.player_repo.create_player(data)
        return PlayerSimple.model_validate(player)

    # -------------------------------------------------
    # GET PLAYER (FULL WITH RELATIONSHIPS)
    # -------------------------------------------------
    def get_player_full(self, player_id: UUID) -> Optional[PlayerFull]:
        player = self.player_repo.get_player_with_relationships(player_id)
        if not player:
            return None
        return PlayerFull.model_validate(player)

    # -------------------------------------------------
    # GET PLAYER (SIMPLE)
    # -------------------------------------------------
    def get_player_simple(self, player_id: UUID) -> Optional[PlayerSimple]:
        player = self.player_repo.get_player(player_id)
        if not player:
            return None
        return PlayerSimple.model_validate(player)

    # -------------------------------------------------
    # LIST PLAYERS (SIMPLE)
    # -------------------------------------------------
    def list_players(self, skip: int = 0, limit: int = 100) -> List[PlayerSimple]:
        # TODO: Add business rule - Filter by team
        # TODO: Add business rule - Filter by position
        # TODO: Add business rule - Filter by skill level
        # TODO: Add business rule - Sort by name, jersey number, etc.

        players = self.player_repo.list_players(skip=skip, limit=limit)
        return [PlayerSimple.model_validate(p) for p in players]

    # -------------------------------------------------
    # UPDATE PLAYER
    # -------------------------------------------------
    def update_player(
        self, player_id: UUID, data: PlayerUpdate
    ) -> Optional[PlayerSimple]:
        # Business Rule: Jersey number must be non-negative
        if data.jersey_number is not None and data.jersey_number < 0:
            raise ValueError("Jersey number must be a non-negative number.")

        # TODO: Add business rule - Check for duplicate jersey numbers within a team
        # TODO: Add business rule - Prevent updates if player is in active match
        # TODO: Add business rule - Validate position changes

        updated = self.player_repo.update_player(player_id, data)
        if not updated:
            return None

        return PlayerSimple.model_validate(updated)

    # -------------------------------------------------
    # DELETE PLAYER
    # -------------------------------------------------
    def delete_player(self, player_id: UUID) -> bool:
        # TODO: Add business rule - Prevent deletion if player has match history
        # TODO: Add business rule - Soft delete instead of hard delete
        # TODO: Add business rule - Archive player data before deletion

        return self.player_repo.delete_player(player_id)
