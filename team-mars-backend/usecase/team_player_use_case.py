"""
Team Player Use Case Module.
This module contains business logic for TeamPlayer operations.
Sits between the API layer (controllers) and the persistence layer (repositories).
"""

from uuid import UUID
from typing import List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from repository.team_player_repository import TeamPlayerRepository
from repository.team_repository import TeamRepository
from repository.player_repository import PlayerRepository
from core.exceptions import NotFoundException, ConflictException, BadRequestException
from model.team_player.team_player import (
    TeamPlayerCreate,
    TeamPlayerUpdate,
    TeamPlayerSimple,
    TeamPlayerFull,
)


class TeamPlayerUseCase:
    """
    Encapsulates business logic for TeamPlayer operations.
    Acts as the intermediary between API controllers and team_player repository layer.
    """

    def __init__(
        self,
        repo: TeamPlayerRepository,
        team_repo: TeamRepository,
        player_repo: PlayerRepository,
    ):
        self.repo = repo
        self.team_repo = team_repo
        self.player_repo = player_repo

    # CREATE A TEAM PLAYER
    async def create_team_player(
        self, session: AsyncSession, payload: TeamPlayerCreate
    ) -> TeamPlayerSimple:
        """
        Add a player to a team with business rule validation.
        """
        # Business Rule: Validate team exists
        team = await self.team_repo.get_team_by_id(session, payload.team_id)
        if not team:
            raise NotFoundException("Team not found.")

        # Business Rule: Validate player exists
        player = await self.player_repo.get_player_by_id(session, payload.player_id)
        if not player:
            raise NotFoundException("Player not found.")

        # Business Rule: Check if player is already on the team (active)
        is_already_on_team = await self.repo.is_player_on_team(
            session, payload.team_id, payload.player_id, active_only=True
        )
        if is_already_on_team:
            raise ConflictException("Player is already an active member of this team.")

        # Business Rule: Set default join_date to now if not provided
        if payload.join_date is None:
            payload.join_date = datetime.utcnow()

        # TODO: Add business rule - Validate roster size limits per team
        # TODO: Add business rule - Validate position against allowed positions
        # TODO: Add business rule - Check if player can join multiple teams

        team_player = await self.repo.create_team_player(session, payload)
        return TeamPlayerSimple.model_validate(team_player)

    # GET ALL TEAM PLAYERS
    async def list_team_players(
        self, session: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[TeamPlayerSimple]:
        """
        List all team players with pagination.
        """
        # TODO: Add business rule - Filter by team
        # TODO: Add business rule - Filter by player
        # TODO: Add business rule - Filter by active/inactive status
        # TODO: Add business rule - Sort by join_date, position, etc.

        team_players = await self.repo.list_team_players(
            session, skip=skip, limit=limit
        )
        return [TeamPlayerSimple.model_validate(tp) for tp in team_players]

    # GET TEAM PLAYER BY ID (SIMPLE)
    async def get_team_player_by_id(
        self, session: AsyncSession, team_player_id: UUID
    ) -> TeamPlayerSimple:
        """
        Get a team player by ID (simple view without relationships).
        """
        team_player = await self.repo.get_team_player_by_id(session, team_player_id)
        if not team_player:
            raise NotFoundException("Team player not found.")
        return TeamPlayerSimple.model_validate(team_player)

    # GET TEAM PLAYER BY ID (FULL WITH RELATIONSHIPS)
    async def get_team_player_full(
        self, session: AsyncSession, team_player_id: UUID
    ) -> TeamPlayerFull:
        """
        Get a team player by ID with all relationships loaded.
        """
        team_player = await self.repo.get_team_player_with_relationships(
            session, team_player_id
        )
        if not team_player:
            raise NotFoundException("Team player not found.")
        return TeamPlayerFull.model_validate(team_player)

    # GET TEAM PLAYERS BY TEAM
    async def get_team_players_by_team(
        self, session: AsyncSession, team_id: UUID, active_only: bool = False
    ) -> List[TeamPlayerSimple]:
        """
        Get all players on a specific team.
        """
        # Business Rule: Validate team exists
        team = await self.team_repo.get_team_by_id(session, team_id)
        if not team:
            raise NotFoundException("Team not found.")

        team_players = await self.repo.get_team_players_by_team(
            session, team_id, active_only
        )
        return [TeamPlayerSimple.model_validate(tp) for tp in team_players]

    # GET TEAM PLAYERS BY PLAYER
    async def get_team_players_by_player(
        self, session: AsyncSession, player_id: UUID, active_only: bool = False
    ) -> List[TeamPlayerSimple]:
        """
        Get all teams a specific player is/was on.
        """
        # Business Rule: Validate player exists
        player = await self.player_repo.get_player_by_id(session, player_id)
        if not player:
            raise NotFoundException("Player not found.")

        team_players = await self.repo.get_team_players_by_player(
            session, player_id, active_only
        )
        return [TeamPlayerSimple.model_validate(tp) for tp in team_players]

    # UPDATE TEAM PLAYER
    async def update_team_player(
        self, session: AsyncSession, team_player_id: UUID, payload: TeamPlayerUpdate
    ) -> TeamPlayerSimple:
        """
        Update an existing team player with business rule validation.
        """
        # Check if team player exists
        team_player = await self.repo.get_team_player_by_id(session, team_player_id)
        if not team_player:
            raise NotFoundException("Team player not found.")

        # Business Rule: Cannot update leave_date if already set (prevent re-activation)
        if payload.leave_date is not None:
            if team_player.leave_date is not None:
                raise BadRequestException(
                    "Cannot update leave date - player has already left the team."
                )

        # TODO: Add business rule - Validate position changes
        # TODO: Add business rule - Prevent updates if player is in active match

        updated = await self.repo.update_team_player(session, team_player_id, payload)
        return TeamPlayerSimple.model_validate(updated)

    # DELETE TEAM PLAYER
    async def delete_team_player(
        self, session: AsyncSession, team_player_id: UUID
    ) -> None:
        """
        Delete a team player by ID (remove from team).
        """
        # Check if team player exists
        team_player = await self.repo.get_team_player_by_id(session, team_player_id)
        if not team_player:
            raise NotFoundException("Team player not found.")

        # TODO: Add business rule - Prevent deletion if player has match history
        # TODO: Add business rule - Soft delete (set leave_date) instead of hard delete
        # TODO: Add business rule - Archive team player data before deletion

        await self.repo.delete_team_player(session, team_player_id)

    # REMOVE PLAYER FROM TEAM (Soft delete)
    async def remove_player_from_team(
        self, session: AsyncSession, team_player_id: UUID
    ) -> TeamPlayerSimple:
        """
        Remove a player from a team by setting leave_date (soft delete).
        """
        team_player = await self.repo.get_team_player_by_id(session, team_player_id)
        if not team_player:
            raise NotFoundException("Team player not found.")

        if team_player.leave_date is not None:
            raise BadRequestException("Player has already left this team.")

        # Set leave_date to now
        payload = TeamPlayerUpdate(leave_date=datetime.utcnow())
        updated = await self.repo.update_team_player(session, team_player_id, payload)
        return TeamPlayerSimple.model_validate(updated)
