from fastapi import APIRouter, Depends, status
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from model.league.league import (
    LeagueSimple,
    LeagueFull,
    LeagueCreate,
    LeagueUpdate,
)
from usecase.league_use_case import LeagueUseCase
from repository.league_repository import LeagueRepository
from repository.database import get_async_session


router = APIRouter(prefix="/league", tags=["League"])

# Inject repository + use case


def get_league_use_case() -> LeagueUseCase:
    repo = LeagueRepository()
    return LeagueUseCase(repo=repo)


# -------------------------------------------------
# CREATE
# -------------------------------------------------
@router.post(
    "",
    response_model=LeagueFull,
    status_code=status.HTTP_201_CREATED,
)
async def create_league(
    payload: LeagueCreate,
    session: AsyncSession = Depends(get_async_session),
    use_case: LeagueUseCase = Depends(get_league_use_case),
):
    return await use_case.create_league(session, payload)


# -------------------------------------------------
# READ — List all
# -------------------------------------------------
@router.get(
    "",
    response_model=list[LeagueSimple],
    status_code=status.HTTP_200_OK,
)
async def list_leagues(
    session: AsyncSession = Depends(get_async_session),
    use_case: LeagueUseCase = Depends(get_league_use_case),
):
    return await use_case.list_leagues(session)


# -------------------------------------------------
# READ — Get by ID
# -------------------------------------------------
@router.get(
    "/{league_id}",
    response_model=LeagueFull,
    status_code=status.HTTP_200_OK,
)
async def get_league(
    league_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: LeagueUseCase = Depends(get_league_use_case),
):
    return await use_case.get_league(session, league_id)


# -------------------------------------------------
# UPDATE
# -------------------------------------------------
@router.put(
    "/{league_id}",
    response_model=LeagueFull,
    status_code=status.HTTP_200_OK,
)
async def update_league(
    league_id: UUID,
    payload: LeagueUpdate,
    session: AsyncSession = Depends(get_async_session),
    use_case: LeagueUseCase = Depends(get_league_use_case),
):
    return await use_case.update_league(session, league_id, payload)


# -------------------------------------------------
# DELETE
# -------------------------------------------------
@router.delete(
    "/{league_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_league(
    league_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: LeagueUseCase = Depends(get_league_use_case),
):
    await use_case.delete_league(session, league_id)
    return
