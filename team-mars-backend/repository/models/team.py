from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base


class Team(Base):
    __tablename__ = "team"
    team_id = Column(UUID(as_uuid=True), primary_key=True)
    team_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign Keys
    league_id = Column(
        UUID(as_uuid=True), ForeignKey("league.league_id"), nullable=False
    )

    # Relationships
    league = relationship("League", back_populates="teams")
    matches_as_team1 = relationship(
        "Match", foreign_keys="Match.team1_id", back_populates="team1"
    )
    matches_as_team2 = relationship(
        "Match", foreign_keys="Match.team2_id", back_populates="team2"
    )
    team_players = relationship("TeamPlayer", back_populates="team")
