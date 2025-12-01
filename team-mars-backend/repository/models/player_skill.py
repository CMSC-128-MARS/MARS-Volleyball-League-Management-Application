from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base


class PlayerSkill(Base):
    __tablename__ = "player_skill"
    player_skill_id = Column(UUID(as_uuid=True), primary_key=True)
    date_assigned = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(String, nullable=True)

    # Foreign Keys
    player_id = Column(
        UUID(as_uuid=True), ForeignKey("player.player_id"), nullable=False
    )
    skill_level_id = Column(
        UUID(as_uuid=True), ForeignKey("skill_level.skill_level_id"), nullable=False
    )

    # Relationships
    player = relationship("Player", back_populates="skills")
    skill_level = relationship("SkillLevel", back_populates="player_skills")
