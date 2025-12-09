from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

# import models
from model.match.match import (
    MatchUpdate,
    MatchCreate,
    MatchSimple,
    MatchWithTeams,
    MatchNested,
    MatchFull,
)
from repository.match_repository import MatchRepository
from core.exceptions import NotFoundException, ConflictException


class MatchUseCase:
    """
    Encapsulates business logic for Match operations,
    Acts as the intermediary between API controllers and repository layer.
    """

    def __init__(self, repo: MatchRepository):
        self.repo = repo

    # CREATE MATCH
    async def create_match(
        self, session: AsyncSession, payload: MatchCreate
    ) -> MatchSimple:
        match = await self.repo.create_match(session, payload)
        return MatchSimple.model_validate(match)

    # READ - GET ALL MATCHES
    async def get_matches(self, session: AsyncSession) -> List[MatchNested]:
        matches = await self.repo.get_matches(session)
        if not matches:
            raise NotFoundException("No matches found.")
        return [MatchNested.model_validate(m) for m in matches]

    # READ - GET ALL MATCHES BY LEAGUE

    async def get_matches_by_league(
        self, session: AsyncSession, league_id: UUID
    ) -> List[MatchFull]:
        matches = await self.repo.get_matches_by_league(session, league_id)
        if not matches:
            raise NotFoundException("No matches found for this league.")

        return [MatchFull.model_validate(m) for m in matches]

    # READ - GET MATCH BY ID

    async def get_match_by_id(
        self, session: AsyncSession, match_id: UUID
    ) -> MatchWithTeams:
        match = await self.repo.get_match_by_id(session, match_id)
        if not match:
            raise NotFoundException("Match not found.")
        return MatchFull.model_validate(match)

    # READ - GET ALL MATCHES BY TEAM
    async def get_matches_by_team(
        self, session: AsyncSession, team_id: UUID
    ) -> MatchNested:
        matches = await self.repo.get_matches_by_team(session, team_id)
        return [MatchNested.model_validate(m) for m in matches]

    # UPDATE

    async def update_match(
        self, session: AsyncSession, match_id: UUID, payload: MatchUpdate
    ) -> MatchSimple:
        match = await self.repo.get_match_by_id(session, match_id)
        if not match:
            raise NotFoundException("Match not found.")

        updated = await self.repo.update_match(session, match_id, payload)
        return MatchSimple.model_validate(updated)

    # DELETE
    async def delete_match(self, session: AsyncSession, match_id: UUID) -> None:
        match = await self.repo.get_match_by_id(session, match_id)
        if not match:
            raise NotFoundException("Match not found.")

        if await self.repo.delete_match(session, match_id):
            print("Match successfully deleted!")
