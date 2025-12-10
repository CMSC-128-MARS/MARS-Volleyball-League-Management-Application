"""
Player Repository Module.
This module provides data access layer for Player entities.
All methods return SQLAlchemy models, not Pydantic schemas.
"""

from typing import List, Optional
from uuid import UUID, uuid4
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from repository.models.player import Player
from sqlalchemy.exc import SQLAlchemyError
from model.player.player import PlayerCreate, PlayerUpdate


class PlayerRepository:
    """Async repository layer for Player model."""

    # CREATE PLAYER
    async def create_player(self, db: AsyncSession, data: PlayerCreate) -> Player:
        try:
            # Normalize incoming data and filter unknown keys
            payload = data.model_dump()

            # Map top-level `skill_notes` -> `notes` if present
            if "notes" in payload and "notes" not in payload:
                payload["notes"] = payload.pop("notes")
            # Only keep player-level keys that exist on the Player model
            allowed_player_keys = {
                "first_name",
                "last_name",
                "jersey_number",
                "default_position",
                "notes",
                "skill_level",
            }

            player_kwargs = {
                k: v for k, v in payload.items() if k in allowed_player_keys
            }

            player = Player(player_id=uuid4(), **player_kwargs)

            db.add(player)
            await db.commit()
            await db.refresh(player)
            return player
        except SQLAlchemyError as e:
            await db.rollback()
            raise e

    # GET PLAYER BY ID
    async def get_player_by_id(
        self, db: AsyncSession, player_id: UUID
    ) -> Optional[Player]:
        result = await db.execute(select(Player).where(Player.player_id == player_id))
        return result.scalars().first()

    # GET PLAYER WITH RELATIONSHIPS
    async def get_player_with_relationships(
        self, db: AsyncSession, player_id: UUID
    ) -> Optional[Player]:
        result = await db.execute(
            select(Player)
            .options(
                selectinload(Player.team_memberships),
            )
            .where(Player.player_id == player_id)
        )
        return result.scalars().first()

    # LIST ALL PLAYERS
    async def list_players(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Player]:
        result = await db.execute(
            select(Player)
            .options(
                selectinload(Player.team_memberships),
            )
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().unique().all()

    # UPDATE PLAYER
    async def update_player(
        self, db: AsyncSession, player_id: UUID, data: PlayerUpdate
    ) -> Optional[Player]:
        player = await self.get_player_by_id(db, player_id)
        if not player:
            return None

        update_fields = data.model_dump(exclude_unset=True)
        for key, value in update_fields.items():
            setattr(player, key, value)

        await db.commit()
        await db.refresh(player)
        return player

    # DELETE PLAYER
    async def delete_player(self, db: AsyncSession, player_id: UUID) -> bool:
        player = await self.get_player_by_id(db, player_id)
        if not player:
            return False

        await db.delete(player)
        await db.commit()
        return True

    # GET PLAYERS BY TEAM
    async def get_players_by_team(
        self, db: AsyncSession, team_id: UUID, load_relationships: bool = False
    ) -> List[Player]:
        stmt = select(Player).join(Player.team_memberships)

        if load_relationships:
            stmt = stmt.options(
                selectinload(Player.team_memberships),
            )

        stmt = stmt.where(Player.team_memberships.any(team_id=team_id)).distinct()
        result = await db.execute(stmt)
        return result.scalars().unique().all()

    # CHECK IF PLAYER EXISTS
    async def player_exists(self, db: AsyncSession, player_id: UUID) -> bool:
        result = await db.execute(select(Player).where(Player.player_id == player_id))
        return result.scalars().first() is not None
