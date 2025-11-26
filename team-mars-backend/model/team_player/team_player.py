from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from uuid import UUID
from model.player.player import PlayerSimple


class TeamPlayerNested(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    team_player_id: UUID = Field(..., title="Team Player ID")
    join_date: datetime = Field(..., title="Join Date")
    leave_date: Optional[datetime] = Field(None, title="Leave Date")
    position: Optional[str] = Field(None, title="Position")
    player: Optional[PlayerSimple] = Field(None, title="Player")

    @property
    def is_active(self) -> bool:
        """Check if player is currently active on team"""
        return self.leave_date is None
