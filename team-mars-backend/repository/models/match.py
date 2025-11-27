from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base


class Match(Base):
    __tablename__ = "match"
    match_id = Column(UUID(as_uuid=True), primary_key=True)
    match_date = Column(DateTime(timezone=True), server_default=func.now())
    location = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign Keys
    league_id = Column(
        UUID(as_uuid=True), ForeignKey("league.league_id"), nullable=False
    )
    team1_id = Column(UUID(as_uuid=True), ForeignKey("team.team_id"), nullable=False)
    team2_id = Column(UUID(as_uuid=True), ForeignKey("team.team_id"), nullable=False)

    # Relationships
    league = relationship("League", back_populates="matches")
    team1 = relationship(
        "Team", foreign_keys=[team1_id], back_populates="matches_as_team1"
    )
    team2 = relationship(
        "Team", foreign_keys=[team2_id], back_populates="matches_as_team2"
    )
    team_stats = relationship("MatchTeamStats", back_populates="match")
    match_stats = relationship("MatchTeamStats", back_populates="team")
