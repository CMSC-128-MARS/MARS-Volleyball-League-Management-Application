from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base
import uuid


class MatchTeamStats(Base):
    __tablename__ = "match_team_stats"
    match_team_stats_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    total_score = Column(Integer, nullable=True)
    sets_won = Column(Integer, nullable=True)
    sets_lost = Column(Integer, nullable=True)
    is_winner = Column(Boolean, nullable=True)

    # Foreign Keys
    match_id = Column(
        UUID(as_uuid=True),
        ForeignKey("match.match_id", ondelete="CASCADE"),
        nullable=False,
    )
    team_id = Column(
        UUID(as_uuid=True),
        ForeignKey("team.team_id", ondelete="CASCADE"),
        nullable=False,
    )

    # Relationships
    match = relationship("Match", back_populates="match_stats")
    team = relationship("Team", back_populates="match_stats")
