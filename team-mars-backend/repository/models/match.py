from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    func,
    Boolean,
    Integer,
    text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base
import uuid


# match.py
class Match(Base):
    __tablename__ = "match"
    match_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    match_date = Column(DateTime(timezone=True), server_default=func.now())
    location = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_completed = Column(Boolean, nullable=False, server_default="false")
    num_of_sets = Column(Integer, nullable=False, server_default=text("1"))

    # foreign keys
    league_id = Column(
        UUID(as_uuid=True),
        ForeignKey("league.league_id", ondelete="CASCADE"),
        nullable=False,
    )
    team1_id = Column(
        UUID(as_uuid=True),
        ForeignKey("team.team_id", ondelete="CASCADE"),
        nullable=False,
    )
    team2_id = Column(
        UUID(as_uuid=True),
        ForeignKey("team.team_id", ondelete="CASCADE"),
        nullable=False,
    )

    # relationships
    league = relationship("League", back_populates="matches")
    team1 = relationship("Team", foreign_keys=[team1_id])
    team2 = relationship("Team", foreign_keys=[team2_id])

    match_stats = relationship(
        "MatchTeamStats",
        back_populates="match",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
