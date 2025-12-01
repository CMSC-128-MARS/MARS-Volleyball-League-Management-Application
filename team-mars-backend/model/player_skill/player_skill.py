from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from uuid import UUID
from model.enums import SkillLevelEnum

if TYPE_CHECKING:
    from model.player.player import PlayerSimple
    from model.skill_level.skill_level import SkillLevelSimple

# Full schema - with relationships (for detailed responses)


class PlayerSkillFull(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    player_skill_id: UUID = Field(..., title="Player Skill ID")
    player_id: UUID = Field(..., title="Player ID")
    skill_level_id: UUID = Field(..., title="Skill Level ID")
    date_assigned: datetime = Field(..., title="Date Assigned")
    notes: Optional[str] = Field(None, title="Notes")

    # Relationships
    skill_level: Optional["SkillLevelSimple"] = Field(None, title="Skill Level Details")
    player: Optional["PlayerSimple"] = None

    @property
    def skill_level_display(self) -> Optional[str]:
        """Get friendly display of skill level"""
        if self.skill_level:
            level_enum = SkillLevelEnum(self.skill_level.level)
            return f"{self.skill_level.level} - {level_enum.name.title()}"
        return None


# Simple schema - without relationships (for basic responses)


class PlayerSkillSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    player_skill_id: UUID = Field(..., title="Player Skill ID")
    player_id: UUID = Field(..., title="Player ID")
    skill_level_id: UUID = Field(..., title="Skill Level ID")
    evaluated_by: UUID = Field(..., title="Evaluator ID")
    date_assigned: datetime = Field(..., title="Date Assigned")
    notes: Optional[str] = Field(None, title="Notes")


# Base schema - for creation


class PlayerSkillCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    player_id: UUID = Field(..., title="Player ID", description="ID of the player")
    skill_level_id: UUID = Field(
        ..., title="Skill Level ID", description="ID of the skill level"
    )
    date_assigned: Optional[datetime] = Field(None, title="Date assigned skill level")
    notes: Optional[str] = Field(None, title="Notes", max_length=500)


# Base schema - for updates


class PlayerSkillUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    skill_level_id: Optional[UUID] = Field(None, title="Skill Level ID")
    notes: Optional[str] = Field(None, title="Notes", max_length=500)


# Nested schema for use in other models (like PlayerFull)


class PlayerSkillNested(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    player_skill_id: UUID = Field(..., title="Player Skill ID")
    date_assigned: datetime = Field(..., title="Date Assigned")
    notes: Optional[str] = Field(None, title="Notes")
    skill_level: Optional["SkillLevelSimple"] = Field(None, title="Skill Level")
    player: Optional["PlayerSimple"] = Field(None, title="Player")


# Nested schemas for relationships


class PlayerSkillEvaluated(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    player_skill_id: UUID = Field(..., title="Player Skill ID")
    player_id: UUID = Field(..., title="Player ID")
    date_assigned: datetime = Field(..., title="Date Assigned")
    notes: Optional[str] = Field(None, title="Notes")
