from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, Any, TYPE_CHECKING
from uuid import UUID

if TYPE_CHECKING:
    from model.player.player import PlayerSimple
    from model.team.team import TeamNested


# Full schema - with relationships (for detailed responses)
class TeamPlayerFull(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    team_player_id: UUID = Field(..., title="Team Player ID")
    team_id: UUID = Field(..., title="Team ID")
    player_id: UUID = Field(..., title="Player ID")
    join_date: datetime = Field(..., title="Join Date")
    leave_date: Optional[datetime] = Field(None, title="Leave Date")
    position: Optional[str] = Field(None, title="Position")

    # Relationships - using Any to avoid circular imports
    team: Optional[TeamNested] = Field(None, title="Team")
    player: Optional[PlayerSimple] = Field(None, title="Player")

    @property
    def is_active(self) -> bool:
        """Check if player is currently active on team"""
        return self.leave_date is None


# Base Schema - for basic responses
class TeamPlayerSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    team_player_id: UUID = Field(..., title="Team Player ID")
    join_date: datetime = Field(..., title="Join Date")
    leave_date: Optional[datetime] = Field(None, title="Leave Date")
    position: Optional[str] = Field(None, title="Position")

    player: Optional[PlayerSimple] = Field(None, title="Player")
    team: Optional[TeamNested] = Field(None, title="Team")

    @property
    def is_active(self) -> bool:
        """Check if player is currently active on team"""
        return self.leave_date is None


# Nested schema - for use in other models (backwards compatibility)
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


# Base schema - for creation (no IDs)
class TeamPlayerCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    team_id: UUID = Field(..., title="Team ID")
    player_id: UUID = Field(..., title="Player ID")
    join_date: Optional[datetime] = Field(None, title="Join Date")
    position: Optional[str] = Field(None, title="Position", max_length=50)


# Base schema - for updates
class TeamPlayerUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    team_id: UUID = Field(None, title="Team ID")
    leave_date: Optional[datetime] = Field(None, title="Leave Date")
    position: Optional[str] = Field(None, title="Position", max_length=50)
