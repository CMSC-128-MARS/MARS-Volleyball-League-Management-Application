"""
Skill Level Repository Module.
This module provides data access layer for SkillLevel entities.
All methods return SQLAlchemy models, not Pydantic schemas.
"""

from typing import List, Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from repository.models.skill_level import SkillLevel
from model.skill_level.skill_level import SkillLevelCreate, SkillLevelUpdate


class SkillLevelRepository:
    """Async repository layer for SkillLevel model."""

    # CREATE SKILL LEVEL
    async def create_skill_level(
        self, db: AsyncSession, data: SkillLevelCreate
    ) -> SkillLevel:
        skill_level = SkillLevel(**data.model_dump())
        db.add(skill_level)
        await db.commit()
        await db.refresh(skill_level)
        return skill_level

    # GET SKILL LEVEL BY ID
    async def get_skill_level_by_id(
        self, db: AsyncSession, skill_level_id: UUID
    ) -> Optional[SkillLevel]:
        result = await db.execute(
            select(SkillLevel).where(SkillLevel.skill_level_id == skill_level_id)
        )
        return result.scalars().first()

    # LIST ALL SKILL LEVELS
    async def list_skill_levels(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
    ) -> List[SkillLevel]:
        result = await db.execute(select(SkillLevel).offset(skip).limit(limit))
        return result.scalars().all()

    # UPDATE SKILL LEVEL
    async def update_skill_level(
        self, db: AsyncSession, skill_level_id: UUID, data: SkillLevelUpdate
    ) -> Optional[SkillLevel]:
        skill_level = await self.get_skill_level_by_id(db, skill_level_id)
        if not skill_level:
            return None

        update_fields = data.model_dump(exclude_unset=True)
        for key, value in update_fields.items():
            setattr(skill_level, key, value)

        await db.commit()
        await db.refresh(skill_level)
        return skill_level

    # DELETE SKILL LEVEL
    async def delete_skill_level(
        self, db: AsyncSession, skill_level_id: UUID
    ) -> bool:
        skill_level = await self.get_skill_level_by_id(db, skill_level_id)
        if not skill_level:
            return False

        await db.delete(skill_level)
        await db.commit()
        return True

    # CHECK IF SKILL LEVEL EXISTS
    async def skill_level_exists(
        self, db: AsyncSession, skill_level_id: UUID
    ) -> bool:
        result = await db.execute(
            select(SkillLevel).where(SkillLevel.skill_level_id == skill_level_id)
        )
        return result.scalars().first() is not None

    # GET SKILL LEVEL BY LEVEL VALUE
    async def get_skill_level_by_level(
        self, db: AsyncSession, level: int
    ) -> Optional[SkillLevel]:
        result = await db.execute(select(SkillLevel).where(SkillLevel.level == level))
        return result.scalars().first()
