"""
Skill Level Use Case Module.
This module contains business logic for SkillLevel operations.
Sits between the API layer (controllers) and the persistence layer (repositories).
"""

from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from repository.skill_level_repository import SkillLevelRepository
from core.exceptions import NotFoundException, ConflictException
from model.skill_level.skill_level import (
    SkillLevelCreate,
    SkillLevelUpdate,
    SkillLevelSimple,
)


class SkillLevelUseCase:
    """
    Encapsulates business logic for SkillLevel operations.
    Acts as the intermediary between API controllers and skill level repository layer.
    """

    def __init__(self, repo: SkillLevelRepository):
        self.repo = repo

    # CREATE A SKILL LEVEL
    async def create_skill_level(
        self, session: AsyncSession, payload: SkillLevelCreate
    ) -> SkillLevelSimple:
        """
        Create a new skill level with business rule validation.
        """
        # Business Rule: Check if skill level with same level value already exists
        existing_skill_level = await self.repo.get_skill_level_by_level(
            session, payload.level
        )
        if existing_skill_level:
            raise ConflictException(
                f'Skill level with level {payload.level} already exists.'
            )

        skill_level = await self.repo.create_skill_level(session, payload)
        return SkillLevelSimple.model_validate(skill_level)

    # GET ALL SKILL LEVELS
    async def list_skill_levels(
        self, session: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[SkillLevelSimple]:
        """
        List all skill levels with pagination.
        """
        skill_levels = await self.repo.list_skill_levels(
            session, skip=skip, limit=limit
        )
        return [SkillLevelSimple.model_validate(sl) for sl in skill_levels]

    # GET SKILL LEVEL BY ID
    async def get_skill_level_by_id(
        self, session: AsyncSession, skill_level_id: UUID
    ) -> SkillLevelSimple:
        """
        Get a skill level by ID.
        """
        skill_level = await self.repo.get_skill_level_by_id(session, skill_level_id)
        if not skill_level:
            raise NotFoundException('Skill level not found.')
        return SkillLevelSimple.model_validate(skill_level)

    # UPDATE SKILL LEVEL
    async def update_skill_level(
        self, session: AsyncSession, skill_level_id: UUID, payload: SkillLevelUpdate
    ) -> SkillLevelSimple:
        """
        Update an existing skill level with business rule validation.
        """
        # Check if skill level exists
        skill_level = await self.repo.get_skill_level_by_id(session, skill_level_id)
        if not skill_level:
            raise NotFoundException('Skill level not found.')

        # Business Rule: If updating level value, check it doesn't conflict with existing
        if payload.level is not None and payload.level != skill_level.level:
            existing_skill_level = await self.repo.get_skill_level_by_level(
                session, payload.level
            )
            if existing_skill_level:
                raise ConflictException(
                    f'Skill level with level {payload.level} already exists.'
                )

        updated = await self.repo.update_skill_level(session, skill_level_id, payload)
        return SkillLevelSimple.model_validate(updated)

    # DELETE SKILL LEVEL
    async def delete_skill_level(
        self, session: AsyncSession, skill_level_id: UUID
    ) -> None:
        """
        Delete a skill level by ID.
        """
        # Check if skill level exists
        skill_level = await self.repo.get_skill_level_by_id(session, skill_level_id)
        if not skill_level:
            raise NotFoundException('Skill level not found.')

        # TODO: Add business rule - Prevent deletion if skill level is assigned to players
        # TODO: Add business rule - Archive skill level data before deletion

        await self.repo.delete_skill_level(session, skill_level_id)
