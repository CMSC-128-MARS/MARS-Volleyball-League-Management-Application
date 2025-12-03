"""
Team Controller Module.

This module contains FastAPI routes for Team operations.
All business logic is delegated to the TeamUseCase layer.
"""

from fastapi import APIRouter, status, Depends
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from model.team.team import (
    TeamFull,
    TeamCreate,
    TeamUpdate,
    TeamNested,
    TeamSimple,
)
from usecase.team_use_case import TeamUseCase
from repository.team_repository import TeamRepository
from repository.database import get_async_session

router = APIRouter(prefix="/team", tags=["Team"])

"""
Inject Repo + Use Case
"""


def get_team_use_case() -> TeamUseCase:
    repo = TeamRepository()
    return TeamUseCase(repo=repo)


"""
CREATE
"""


@router.post(
    "",
    response_model=TeamSimple,
    status_code=status.HTTP_201_CREATED,
)
async def create_team(
    payload: TeamCreate,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamUseCase = Depends(get_team_use_case),
):
    return await use_case.create_team(session, payload)


"""
READ ALL TEAMS
"""


@router.get(
    "",
    response_model=list[TeamNested],
    status_code=status.HTTP_200_OK,
)
async def list_teams(
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamUseCase = Depends(get_team_use_case),
):
    return await use_case.list_teams(session)


"""
GET BY ID 
"""


@router.get(
    "/{team_id}",
    response_model=TeamFull,
    status_code=status.HTTP_200_OK,
)
async def get_team_by_id(
    team_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamUseCase = Depends(get_team_use_case),
):
    return await use_case.get_team_by_id(session, team_id)


"""
UPDATE 
"""


@router.put(
    "/{team_id}",
    response_model=TeamSimple,
    status_code=status.HTTP_200_OK,
)
async def update_team(
    team_id: UUID,
    payload: TeamUpdate,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamUseCase = Depends(get_team_use_case),
):
    return await use_case.update_team(session, team_id, payload)


"""
DELETE
"""


@router.delete(
    "/{team_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_team(
    team_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: TeamUseCase = Depends(get_team_use_case),
):
    return await use_case.delete_team(session, team_id)
