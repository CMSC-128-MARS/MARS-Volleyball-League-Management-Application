# model/player/player.py
from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base
from model.enums import SkillLevelEnum
import uuid


class Player(Base):
    __tablename__ = "player"

    player_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String)
    jersey_number = Column(Integer)
    default_position = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(String, nullable=True)
    skill_level = Column(Integer, nullable=True)

    team_memberships = relationship("TeamPlayer", back_populates="player")

    @validates("skill_level")
    def validate_skill_level(self, key, skill_level):
        if skill_level is not None:
            valid_levels = [level.value for level in SkillLevelEnum]
            if skill_level not in valid_levels:
                raise ValueError(
                    f"Invalid skill level: {skill_level}. Must be one of {valid_levels}"
                )
        return skill_level

    @property
    def skill_level_name(self) -> str:
        """Get the name of the skill level"""
        if self.skill_level:
            return SkillLevelEnum(self.skill_level).name
        return "Not Assigned"

    @property
    def skill_level_display(self) -> str:
        """Get display string for skill level"""
        if self.skill_level:
            return (
                f"{self.skill_level} - {SkillLevelEnum(self.skill_level).name.title()}"
            )
        return "Not Assigned"
