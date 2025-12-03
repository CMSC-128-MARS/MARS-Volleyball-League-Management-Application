from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base
import uuid


class Team(Base):
    __tablename__ = "team"
    team_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign Keys
    league_id = Column(
        UUID(as_uuid=True), ForeignKey("league.league_id"), nullable=False
    )

    # Relationships
    league = relationship("League", back_populates="teams")

    # Delete team_players on team deletion
    team_players = relationship(
        "TeamPlayer",
        back_populates="team",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # Single relationship to all matches where the team appears
    matches = relationship(
        "Match",
        primaryjoin="or_(Team.team_id==Match.team1_id, Team.team_id==Match.team2_id)",
        viewonly=True,
    )

    match_stats = relationship(
        "MatchTeamStats",
        back_populates="team",
        cascade="save-update",
        passive_deletes=True,
    )
