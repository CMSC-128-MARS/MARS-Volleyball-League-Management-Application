from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base
import uuid


class League(Base):
    __tablename__ = "league"
    league_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    league_name = Column(String, nullable=False)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), nullable=True)
    location = Column(String, nullable=False)
    description = Column(String, nullable=True)

    # Relationships
    matches = relationship("Match", back_populates="league")

    # Relationships with CASCADE DELETE
    teams = relationship("Team", back_populates="league", cascade="all, delete-orphan")
    matches = relationship(
        "Match", back_populates="league", cascade="all, delete-orphan"
    )
