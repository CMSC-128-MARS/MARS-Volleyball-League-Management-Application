from fastapi import APIRouter, status, Depends
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

# import models
from model.match.match import (
    MatchFull,
    MatchCreate,
    MatchUpdate,
    MatchWithTeams,
    MatchNested,
    MatchSimple,
)
from usecase.match_use_case import MatchUseCase
from repository.match_repository import MatchRepository
from repository.database import get_async_session

router = APIRouter(prefix="/match", tags=["Match"])


def get_match_use_case() -> MatchUseCase:
    repo = MatchRepository()
    return MatchUseCase(repo=repo)


"""
CREATE 
"""


@router.post(
    "",
    response_model=MatchSimple,
    status_code=status.HTTP_201_CREATED,
)
async def create_match(
    payload: MatchCreate,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchUseCase = Depends(get_match_use_case),
):
    return await use_case.create_match(session, payload)


"""
READ - GET ALL MATCHES 
"""


@router.get(
    "",
    response_model=List[MatchNested],
    status_code=status.HTTP_200_OK,
)
async def get_matches(
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchUseCase = Depends(get_match_use_case),
):
    return await use_case.get_matches(session)


"""
READ - GET ALL MATCHES BY TEAM 
"""


@router.get(
    "/{team_id}",
    response_model=List[MatchNested],
    status_code=status.HTTP_200_OK,
)
async def get_matches_by_team(
    team_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchUseCase = Depends(get_match_use_case),
):
    matches = await use_case.get_matches_by_team(session, team_id)
    return matches


"""
READ ALL MATCHES BY LEAGUE WITH CONDITIONAL = is_completed=true/false
"""


@router.get(
    "/league/{league_id}",
    response_model=List[MatchFull],
    status_code=status.HTTP_200_OK,
)
async def get_matches_by_league(
    league_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchUseCase = Depends(get_match_use_case),
):
    """
    Returns all matches for a league. For upcoming matches, `team_stats` will be excluded.
    """
    matches = await use_case.get_matches_by_league(session, league_id)

    # Dynamically exclude team_stats for matches that are not completed
    serialized = []
    for match in matches:
        exclude_fields = {"team_stats"} if not match.is_completed else set()
        serialized.append(
            MatchFull.model_validate(match).model_dump(exclude=exclude_fields)
        )

    return serialized


"""
GET MATCH BY ID
"""


@router.get(
    "/{match_id}",
    response_model=MatchWithTeams,
    status_code=status.HTTP_200_OK,
)
async def get_match_by_id(
    match_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchUseCase = Depends(get_match_use_case),
):
    return await use_case.get_match_by_id(session, match_id)


"""
UPDATE MATCH BY ID 
"""


@router.put(
    "/{match_id}",
    response_model=MatchSimple,
    status_code=status.HTTP_200_OK,
)
async def update_match(
    match_id: UUID,
    payload: MatchUpdate,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchUseCase = Depends(get_match_use_case),
):
    return await use_case.update_match(session, match_id, payload)


"""
DELETE MATCH BY ID
"""


@router.delete(
    "/{match_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_match(
    match_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: MatchUseCase = Depends(get_match_use_case),
):
    return await use_case.delete_match(session, match_id)
