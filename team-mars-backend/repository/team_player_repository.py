"""
Team Player Repository Module.
This module provides data access layer for TeamPlayer entities.
All methods return SQLAlchemy models, not Pydantic schemas.
"""

from typing import List, Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from repository.models.team_player import TeamPlayer
from model.team_player.team_player import TeamPlayerCreate, TeamPlayerUpdate


class TeamPlayerRepository:
    """Async repository layer for TeamPlayer model."""

    # CREATE TEAM PLAYER
    async def create_team_player(
        self, db: AsyncSession, data: TeamPlayerCreate
    ) -> TeamPlayer:
        team_player = TeamPlayer(**data.model_dump())
        db.add(team_player)
        await db.commit()
        await db.refresh(team_player)
        return team_player

    # GET TEAM PLAYER BY ID
    async def get_team_player_by_id(
        self, db: AsyncSession, team_player_id: UUID
    ) -> Optional[TeamPlayer]:
        result = await db.execute(
            select(TeamPlayer)
            .options(
                selectinload(TeamPlayer.player),
                selectinload(TeamPlayer.team),
            )
            .where(TeamPlayer.team_player_id == team_player_id)
        )
        return result.scalars().first()

    # GET TEAM PLAYER WITH RELATIONSHIPS

    async def get_team_player_with_relationships(
        self, db: AsyncSession, team_player_id: UUID
    ) -> Optional[TeamPlayer]:
        result = await db.execute(
            select(TeamPlayer)
            .options(
                selectinload(TeamPlayer.team),
                selectinload(TeamPlayer.player),
            )
            .where(TeamPlayer.team_player_id == team_player_id)
        )
        return result.scalars().first()

    # LIST ALL TEAM PLAYERS
    async def list_team_players(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TeamPlayer]:
        result = await db.execute(
            select(TeamPlayer)
            .options(
                selectinload(TeamPlayer.team),
                selectinload(TeamPlayer.player),
            )
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().unique().all()

    # GET TEAM PLAYERS BY TEAM ID
    async def get_team_players_by_team(
        self, db: AsyncSession, team_id: UUID, active_only: bool = False
    ) -> List[TeamPlayer]:
        stmt = select(TeamPlayer).options(
            selectinload(TeamPlayer.player),
        )
        stmt = stmt.where(TeamPlayer.team_id == team_id)

        if active_only:
            stmt = stmt.where(TeamPlayer.leave_date.is_(None))

        result = await db.execute(stmt)
        return result.scalars().unique().all()

    # GET TEAM PLAYERS BY PLAYER ID
    async def get_team_players_by_player(
        self, db: AsyncSession, player_id: UUID, active_only: bool = False
    ) -> List[TeamPlayer]:
        stmt = select(TeamPlayer).options(
            selectinload(TeamPlayer.team),
        )
        stmt = stmt.where(TeamPlayer.player_id == player_id)

        if active_only:
            stmt = stmt.where(TeamPlayer.leave_date.is_(None))

        result = await db.execute(stmt)
        return result.scalars().unique().all()

    # UPDATE TEAM PLAYER
    async def update_team_player(
        self, db: AsyncSession, team_player_id: UUID, data: TeamPlayerUpdate
    ) -> Optional[TeamPlayer]:
        team_player = await self.get_team_player_by_id(db, team_player_id)
        if not team_player:
            return None

        update_fields = data.model_dump(exclude_unset=True)
        for key, value in update_fields.items():
            setattr(team_player, key, value)

        await db.commit()
        await db.refresh(team_player)
        return team_player

    # DELETE TEAM PLAYER
    async def delete_team_player(self, db: AsyncSession, team_player_id: UUID) -> bool:
        team_player = await self.get_team_player_by_id(db, team_player_id)
        if not team_player:
            return False

        await db.delete(team_player)
        await db.commit()
        return True

    # CHECK IF TEAM PLAYER EXISTS
    async def team_player_exists(self, db: AsyncSession, team_player_id: UUID) -> bool:
        result = await db.execute(
            select(TeamPlayer).where(TeamPlayer.team_player_id == team_player_id)
        )
        return result.scalars().first() is not None

    # CHECK IF PLAYER IS ON TEAM
    async def is_player_on_team(
        self, db: AsyncSession, team_id: UUID, player_id: UUID, active_only: bool = True
    ) -> bool:
        stmt = select(TeamPlayer).where(
            TeamPlayer.team_id == team_id, TeamPlayer.player_id == player_id
        )

        if active_only:
            stmt = stmt.where(TeamPlayer.leave_date.is_(None))

        result = await db.execute(stmt)
        return result.scalars().first() is not None
