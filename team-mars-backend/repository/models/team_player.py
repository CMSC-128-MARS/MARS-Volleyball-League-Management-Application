from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import func, relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base


class TeamPlayer(Base):
    __tablename__ = "team_player"
    team_player_id = Column(UUID(as_uuid=True), primary_key=True)
    join_date = Column(DateTime(timezone=True), server_default=func.now())
    leave_date = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    position = Column(String, nullable=True)

    # Foreign Keys
    team_id = Column(UUID(as_uuid=True), ForeignKey("team.team_id"), nullable=False)
    player_id = Column(
        UUID(as_uuid=True), ForeignKey("player.player_id"), nullable=False
    )

    # Relationships
    team = relationship("Team", back_populates="team_players")
    player = relationship("Player", back_populates="team_memberships")
