from repository.models.team import Team
from model.team.team import TeamCreate
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from sqlalchemy import select


class TeamRepository:
    """Async repository layer for Team model."""

    def __init__(self):
        pass

    # CREATE TEAM
    async def create(self, db: AsyncSession, data: TeamCreate) -> Team:
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
        return result.scalar().first()

    # LIST ALL TEAMS

    # GET TEAM BY ID

    # UPDATE TEAM

    # DELETE TEAM
