from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base
import uuid


class Player(Base):
    __tablename__ = "player"
    player_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True)
    jersey_number = Column(Integer, nullable=True)
    default_position = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    skills = relationship("PlayerSkill", back_populates="player")
    team_memberships = relationship("TeamPlayer", back_populates="player")
