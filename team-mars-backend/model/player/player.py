# schema/player.py
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime
from model.enums import SkillLevelEnum


class PlayerCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    first_name: str = Field(..., title="First Name", max_length=100)
    last_name: Optional[str] = Field(None, title="Last Name", max_length=100)
    jersey_number: Optional[int] = Field(None, title="Jersey Number", ge=0, le=999)
    default_position: Optional[str] = Field(
        None, title="Default Position", max_length=51
    )

    # Skill level directly embedded
    skill_level: Optional[int] = Field(
        None,
        title="Skill Level",
        description="1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert, 5=Professional",
        ge=1,
        le=5,
    )
    skill_notes: Optional[str] = Field(None, title="Skill Notes", max_length=500)

    @field_validator("skill_level")
    @classmethod
    def validate_skill_level(cls, v: Optional[int]) -> Optional[int]:
        if v is not None:
            valid_levels = [level.value for level in SkillLevelEnum]
            if v not in valid_levels:
                raise ValueError(
                    f"Invalid skill level: {v}. Must be one of {valid_levels}"
                )
        return v


class PlayerUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    first_name: Optional[str] = Field(None, title="First Name", max_length=100)
    last_name: Optional[str] = Field(None, title="Last Name", max_length=100)
    jersey_number: Optional[int] = Field(None, title="Jersey Number", ge=0, le=999)
    default_position: Optional[str] = Field(
        None, title="Default Position", max_length=50
    )
    notes: Optional[str] = Field(None, title="Player Notes", max_length=500)
    skill_level: Optional[int] = Field(None, title="Skill Level", ge=1, le=5)

    @field_validator("skill_level")
    @classmethod
    def validate_skill_level(cls, v: Optional[int]) -> Optional[int]:
        if v is not None:
            valid_levels = [level.value for level in SkillLevelEnum]
            if v not in valid_levels:
                raise ValueError(
                    f"Invalid skill level: {v}. Must be one of {valid_levels}"
                )
        return v


class PlayerSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    player_id: UUID
    first_name: str
    last_name: Optional[str] = None
    jersey_number: Optional[int] = None
    default_position: Optional[str] = None
    created_at: datetime
    notes: Optional[str] = None
    skill_level: Optional[int] = None

    @property
    def skill_level_display(self) -> Optional[str]:
        if self.skill_level:
            return (
                f"{self.skill_level} - {SkillLevelEnum(self.skill_level).name.title()}"
            )
        return "Not Assigned"


class PlayerFull(PlayerSimple):
    # Add any additional relationships here if needed
    pass
