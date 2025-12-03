from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from model.league.league import LeagueSimple, LeagueFull, LeagueCreate, LeagueUpdate
from repository.league_repository import LeagueRepository
from core.exceptions import NotFoundException, ConflictException


class LeagueUseCase:
    """
    Encapsulates business logic for League operations.
    Acts as the intermediary between API controllers and repository layer.
    """

    def __init__(self, repo: LeagueRepository):
        self.repo = repo

    # ---------------------------------------------
    # CREATE
    # ---------------------------------------------
    async def create_league(
        self, session: AsyncSession, payload: LeagueCreate
    ) -> LeagueSimple:
        """
        Create a new league with validation logic.
        """

        # Example business logic: Ensure no duplicate league names
        existing = await self.repo.get_league_by_name(session, payload.league_name)
        if existing:
            raise ConflictException("League with this name already exists.")

        league = await self.repo.create_league(session, payload)
        return LeagueSimple.model_validate(league)

    # ---------------------------------------------
    # READ — Get all leagues
    # ---------------------------------------------
    async def list_leagues(self, session: AsyncSession) -> List[LeagueSimple]:
        leagues = await self.repo.list_leagues(session)
        if not leagues:
            raise NotFoundException("League not found.")
        return [LeagueSimple.model_validate(league) for league in leagues]

    # ---------------------------------------------
    # READ — Get by ID
    # ---------------------------------------------
    async def get_league(self, session: AsyncSession, league_id: UUID) -> LeagueFull:
        league = await self.repo.get_league_by_id(session, league_id)
        if not league:
            raise NotFoundException("League not found.")
        return LeagueFull.model_validate(league)

    # ---------------------------------------------
    # UPDATE
    # ---------------------------------------------
    async def update_league(
        self, session: AsyncSession, league_id: UUID, payload: LeagueUpdate
    ) -> LeagueFull:
        league = await self.repo.get_league_by_id(session, league_id)
        if not league:
            raise NotFoundException("League not found.")

        updated = await self.repo.update_league(session, league_id, payload)
        return LeagueFull.model_validate(updated)

    # ---------------------------------------------
    # DELETE
    # ---------------------------------------------
    async def delete_league(self, session: AsyncSession, league_id: UUID) -> None:
        league = await self.repo.get_league_by_id(session, league_id)
        if not league:
            raise NotFoundException("League not found.")

        await self.repo.delete_league(session, league_id)
