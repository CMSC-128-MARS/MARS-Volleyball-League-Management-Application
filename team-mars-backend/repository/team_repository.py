from repository.models.team import Team
from model.team.team import TeamCreate, TeamUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from sqlalchemy import select
from uuid import UUID
from sqlalchemy.orm import selectinload


class TeamRepository:
    """Async repository layer for Team model."""

    # CREATE TEAM
    async def create_team(self, db: AsyncSession, data: TeamCreate) -> Team:
        team = Team(**data.model_dump())
        db.add(team)
        await db.commit()
        await db.refresh(team)
        return team

    # GET BY TEAM NAME
    async def get_by_team_name(
        self, db: AsyncSession, team_name: str
    ) -> Optional[Team]:
        result = await db.execute(select(Team).where(Team.team_name == team_name))
        return result.scalars().first()

    # LIST ALL TEAMS
    async def get_teams(self, db: AsyncSession) -> List[Team]:
        result = await db.execute(
            select(Team).options(
                selectinload(Team.team_players),
                selectinload(Team.matches),
                selectinload(Team.league),
            )
        )
        return result.scalars().unique().all()

    # GET TEAM BY ID
    async def get_team_by_id(self, db: AsyncSession, team_id: UUID) -> Optional[Team]:
        result = await db.execute(
            select(Team)
            .options(
                selectinload(Team.team_players),
                selectinload(Team.matches),
                selectinload(Team.league),
                selectinload(Team.match_stats),
            )
            .where(Team.team_id == team_id)
        )
        return result.scalars().first()

    # UPDATE TEAM

    async def update_team(
        self, db: AsyncSession, team_id: UUID, data: TeamUpdate
    ) -> Optional[Team]:
        team = await self.get_team_by_id(db, team_id)
        if not team:
            return None

        update_fields = data.model_dump(exclude_unset=True)
        for key, value in update_fields.items():
            setattr(team, key, value)

        await db.commit()
        await db.refresh(team)
        return team

    # DELETE TEAM
    async def delete_team(self, db: AsyncSession, team_id: UUID) -> bool:
        team = await self.get_team_by_id(db, team_id)
        if not team:
            return False
        await db.delete(team)
        await db.commit()
        return True
