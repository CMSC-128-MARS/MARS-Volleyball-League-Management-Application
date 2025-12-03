from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update as sa_update, delete as sa_delete
from repository.models.league import League
from model.league.league import LeagueCreate, LeagueUpdate
from sqlalchemy.orm import selectinload


class LeagueRepository:
    """Async repository layer for League model."""

    # -------------------------------------------
    # CREATE
    # -------------------------------------------
    async def create_league(self, db: AsyncSession, data: LeagueCreate) -> League:
        league = League(**data.model_dump())
        db.add(league)
        await db.commit()
        await db.refresh(league)
        return league

    # -------------------------------------------
    # GET BY NAME
    # -------------------------------------------
    async def get_league_by_name(self, db: AsyncSession, name: str) -> Optional[League]:
        result = await db.execute(select(League).where(League.league_name == name))
        return result.scalars().first()

    # -------------------------------------------
    # LIST
    # -------------------------------------------
    async def list_leagues(self, db: AsyncSession) -> List[League]:
        result = await db.execute(select(League))
        return result.scalars().all()

    # -------------------------------------------
    # READ BY ID
    # -------------------------------------------
    async def get_league_by_id(
        self, db: AsyncSession, league_id: UUID
    ) -> Optional[League]:
        result = await db.execute(
            select(League)
            .options(selectinload(League.matches), selectinload(League.teams))
            .where(League.league_id == league_id)
        )
        return result.scalars().first()

    # -------------------------------------------
    # UPDATE
    # -------------------------------------------
    async def update_league(
        self, db: AsyncSession, league_id: UUID, data: LeagueUpdate
    ) -> Optional[League]:
        league = await self.get_by_id(db, league_id)
        if not league:
            return None

        update_fields = data.model_dump(exclude_unset=True)
        for key, value in update_fields.items():
            setattr(league, key, value)

        await db.commit()
        await db.refresh(league)
        return league

    # -------------------------------------------
    # DELETE
    # -------------------------------------------
    async def delete_league(self, db: AsyncSession, league_id: UUID) -> bool:
        league = await self.get_by_id(db, league_id)
        if not league:
            return False

        await db.delete(league)
        await db.commit()
        return True
