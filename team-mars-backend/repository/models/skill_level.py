from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base
from model.enums import SkillLevelEnum
import uuid


class SkillLevel(Base):
    __tablename__ = "skill_level"
    skill_level_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    level = Column(Integer, nullable=False)
    level_description = Column(String, nullable=True)

    # Relationships
    player_skills = relationship("PlayerSkill", back_populates="skill_level")

    # Validation
    @validates("level")
    def validate_level(self, key, level):
        valid_levels = [enum_item.value for enum_item in SkillLevelEnum]
        if level not in valid_levels:
            raise ValueError(
                f"Invalid skill level: {level}. Must be one of {valid_levels}"
            )
        return level
