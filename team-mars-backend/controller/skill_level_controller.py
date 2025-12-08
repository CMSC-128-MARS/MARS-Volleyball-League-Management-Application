"""
Skill Level Controller Module.
This module contains FastAPI routes for SkillLevel operations.
All business logic is delegated to the SkillLevelUseCase layer.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List
from model.skill_level.skill_level import (
    SkillLevelCreate,
    SkillLevelUpdate,
    SkillLevelSimple,
)
from usecase.skill_level_use_case import SkillLevelUseCase
from repository.database import get_async_session
from repository.skill_level_repository import SkillLevelRepository

router = APIRouter(prefix='/skill-levels', tags=['Skill Levels'])


def get_skill_level_use_case() -> SkillLevelUseCase:
    """Dependency injection for SkillLevelUseCase."""
    skill_level_repo = SkillLevelRepository()
    return SkillLevelUseCase(repo=skill_level_repo)


@router.post('/', response_model=SkillLevelSimple, status_code=status.HTTP_201_CREATED)
async def create_skill_level(
    payload: SkillLevelCreate,
    session: AsyncSession = Depends(get_async_session),
    use_case: SkillLevelUseCase = Depends(get_skill_level_use_case),
):
    """Create a new skill level."""
    return await use_case.create_skill_level(session, payload)


@router.get('/', response_model=List[SkillLevelSimple])
async def list_skill_levels(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_async_session),
    use_case: SkillLevelUseCase = Depends(get_skill_level_use_case),
):
    """List all skill levels with pagination."""
    return await use_case.list_skill_levels(session, skip=skip, limit=limit)


@router.get('/{skill_level_id}', response_model=SkillLevelSimple)
async def get_skill_level(
    skill_level_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: SkillLevelUseCase = Depends(get_skill_level_use_case),
):
    """Get a skill level by ID."""
    return await use_case.get_skill_level_by_id(session, skill_level_id)


@router.put('/{skill_level_id}', response_model=SkillLevelSimple)
async def update_skill_level(
    skill_level_id: UUID,
    payload: SkillLevelUpdate,
    session: AsyncSession = Depends(get_async_session),
    use_case: SkillLevelUseCase = Depends(get_skill_level_use_case),
):
    """Update an existing skill level."""
    return await use_case.update_skill_level(session, skill_level_id, payload)


@router.delete('/{skill_level_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill_level(
    skill_level_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    use_case: SkillLevelUseCase = Depends(get_skill_level_use_case),
):
    """Delete a skill level by ID."""
    await use_case.delete_skill_level(session, skill_level_id)
