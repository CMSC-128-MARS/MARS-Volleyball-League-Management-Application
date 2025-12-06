from uuid import UUID
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from repository.team_repository import TeamRepository
from repository.match_repository import MatchRepository
from core.exceptions import NotFoundException, ConflictException
from model.team.team import TeamCreate, TeamFull, TeamSimple, TeamUpdate, TeamNested


class TeamUseCase:
    """
    Encapsulates business logic for Team operations.
    Acts as the intermediary between API controllers and team repository layer.
    """

    def __init__(self, repo: TeamRepository, match_repo: MatchRepository):
        self.repo = repo
        self.match_repo = match_repo

    # CREATE A TEAM
    async def create_team(
        self, session: AsyncSession, payload: TeamCreate
    ) -> TeamSimple:
        """
        Create a new team
        """

        existing = await self.repo.get_by_team_name(session, payload.team_name)
        if existing:
            raise ConflictException("Team with this name already exists.")

        team = await self.repo.create_team(session, payload)
        return TeamSimple.model_validate(team)

    # READ - GET ALL TEAMS
    async def list_teams(self, session: AsyncSession) -> TeamNested:
        teams = await self.repo.get_teams(session)
        return [TeamNested.model_validate(team) for team in teams]

    # GET TEAM BY ID
    async def get_team_by_id(self, session: AsyncSession, team_id: UUID) -> TeamFull:
        team = await self.repo.get_team_by_id(session, team_id)
        if not team:
            raise NotFoundException("Team not found.")
        return TeamFull.model_validate(team)

    # UPDATE
    async def update_team(
        self, session: AsyncSession, team_id: UUID, payload: TeamUpdate
    ) -> TeamSimple:
        team = await self.repo.get_team_by_id(session, team_id)
        if not team:
            raise NotFoundException("Team not found.")

        updated = await self.repo.update_team(session, team_id, payload)
        return TeamSimple.model_validate(updated)

    # DELETE
    async def delete_team(self, session: AsyncSession, team_id: UUID) -> None:
        team = await self.repo.get_team_by_id(session, team_id)
        if not team:
            raise NotFoundException("Team not found.")

        # NEW: check if team is referenced
        matches = await self.match_repo.get_matches_by_team(session, team_id)
        if matches:
            raise ConflictException(
                "Cannot delete team because there are matches associated with it."
            )

        await self.repo.delete_team(session, team_id)
