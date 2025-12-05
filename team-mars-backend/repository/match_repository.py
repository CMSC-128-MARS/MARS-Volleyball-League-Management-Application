from repository.models.match import Match
from model.match.match import MatchCreate, MatchUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from sqlalchemy import select
from uuid import UUID
from sqlalchemy.orm import selectinload


class MatchRepository:
    """Async repository layer for Match model."""

    """
    create a match 
    return data: match
    """

    async def create_match(self, db: AsyncSession, data: MatchCreate) -> Match:
        match = Match(**data.model_dump())
        db.add(match)
        await db.commit()
        await db.refresh(match)
        return match

    """
    list all matches 
    return data: array of match simple 
    """

    async def get_matches(self, db: AsyncSession) -> List[Match]:
        result = await db.execute(
            select(Match).options(
                selectinload(Match.league),
                selectinload(Match.team1),
                selectinload(Match.team2),
            )
        )
        return result.scalars().unique().all()

    """
    list all matches by league 
    return data: array of match nested by league 
    """

    async def get_matches_by_league(
        self, db: AsyncSession, league_id: UUID
    ) -> List[Match]:
        result = await db.execute(
            select(Match)
            .options(
                selectinload(Match.league),
                selectinload(Match.team1),
                selectinload(Match.team2),
            )
            .where(Match.league_id == league_id)
        )
        return result.scalars().unique().all()

    """
    get match by id 
    return data: match
    """

    async def get_match_by_id(
        self, db: AsyncSession, match_id: UUID
    ) -> Optional[Match]:
        result = await db.execute(
            select(Match)
            .options(
                selectinload(Match.league),
            )
            .where(Match.match_id == match_id)
        )
        return result.scalars().first()

    """
    get match by id in a specific league 
    """

    async def get_match_by_id_in_league(
        self, db: AsyncSession, match_id: UUID, league_id: UUID
    ) -> Optional[Match]:
        result = await db.execute(
            select(Match)
            .options(
                selectinload(Match.league),
                selectinload(Match.team1),
                selectinload(Match.team2),
            )
            .where(Match.match_id == match_id)
            .where(Match.league_id == league_id)
        )
        return result.scalars().first()

    """
    update match by id 
    return data: match
    """

    async def update_match(
        self, db: AsyncSession, match_id: UUID, data: MatchUpdate
    ) -> Optional[Match]:
        match = await self.get_match_by_id(db, match_id)
        if not match:
            return None

        update_fields = data.model_dump(exclude_unset=True)
        for key, value in update_fields.items():
            setattr(match, key, value)

        await db.commit()
        await db.refresh(match)
        return match

    """
    delete a match by id 
    """

    async def delete_match(self, db: AsyncSession, match_id: UUID) -> bool:
        match = await self.get_match_by_id(db, match_id)
        if not match:
            return False

        await db.delete(match)
        await db.commit()
        return True
