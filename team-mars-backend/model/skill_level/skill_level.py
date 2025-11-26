from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional
from uuid import UUID
from model.enums import SkillLevelEnum


class SkillLevelSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    skill_level_id: UUID = Field(..., title="Skill Level ID")
    level: int = Field(..., title="Skill Level")
    level_description: Optional[str] = Field(None, title="Level Description")

    @property
    def level_name(self) -> str:
        """Get the name of the skill level"""

        return SkillLevelEnum(self.level).name

    @property
    def level_display(self) -> str:
        """Get display string for skill level"""
        return f"{self.level} - {SkillLevelEnum(self.level).name.title()}"


class SkillLevelCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    level: int = Field(
        ...,
        title="Skill Level",
        description="Skill level (1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert, 5=Professional)",
        ge=1,
        le=5,
    )
    level_description: Optional[str] = Field(
        None, title="Level Description", max_length=200
    )

    @field_validator("level")
    @classmethod
    def validate_level(cls, v: int) -> int:
        valid_levels = [level.value for level in SkillLevelEnum]
        if v not in valid_levels:
            raise ValueError(f"Invalid skill level: {v}. Must be one of {valid_levels}")

        return v


class SkillLevelUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    level: Optional[int] = Field(None, title="Skill Level", ge=1, le=5)
    level_description: Optional[str] = Field(
        None, title="Level Description", max_length=200
    )

    @field_validator("level")
    @classmethod
    def validate_level(cls, v: Optional[int]) -> Optional[int]:

        if v is not None:
            valid_levels = [level.value for level in SkillLevelEnum]
            if v not in valid_levels:
                raise ValueError(
                    f"Invalid skill level: {v}. Must be one of {valid_levels}"
                )

        return v
