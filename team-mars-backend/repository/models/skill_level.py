from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base


class SkillLevel(Base):
    __tablename__ = "skill_level"
    skill_level_id = Column(UUID(as_uuid=True), primary_key=True)
    level = Column(Integer, nullable=False)
    level_description = Column(String, nullable=True)

    # Relationships
    player_skills = relationship("PlayerSkill", back_populates="skill_level")
