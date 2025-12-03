from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from typing import TYPE_CHECKING

# Use TYPE_CHECKING to avoid circular imports
if TYPE_CHECKING:
    from model.team_player.team_player import TeamPlayerNested
    from model.league.league import LeagueNested
    from model.match.match import MatchSimple


# Full schema - with relationships (for detailed responses)


class TeamFull(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    team_id: UUID = Field(..., title="Team ID")
    team_name: str = Field(..., title="Team Name")
    league_id: UUID = Field(..., title="League ID")
    created_at: datetime = Field(..., title="Date Created")

    # Relationships
    league: Optional["LeagueNested"] = Field(None, title="League")
    team_players: Optional[List["TeamPlayerNested"]] = Field(None, title="Team Players")
    matches: Optional[List["MatchSimple"]] = Field(None, title="Matches")

    @property
    def active_players(self) -> List["TeamPlayerNested"]:
        """Get only active players (no leave_date)"""
        if self.team_players:
            return [tp for tp in self.team_players if tp.leave_date is None]
        return []

    @property
    def total_matches(self) -> int:
        """Get total number of matches played"""
        count = 0
        if self.matches_as_team1:
            count += len(self.matches_as_team1)
        if self.matches_as_team2:
            count += len(self.matches_as_team2)
        return count


# Simple schema - without relationships (for basic responses)


class TeamSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    team_id: UUID = Field(..., title="Team ID")
    team_name: str = Field(..., title="Team Name")
    league_id: UUID = Field(..., title="League ID")
    created_at: datetime = Field(..., title="Date Created")


# Base schema - for creation


class TeamCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    team_name: str = Field(..., title="Team Name", max_length=100, min_length=1)
    league_id: UUID = Field(
        ..., title="League ID", description="ID of the league this team belongs to"
    )


# Base schema - for updates


class TeamUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    team_name: Optional[str] = Field(
        None, title="Team Name", max_length=100, min_length=1
    )
    league_id: Optional[UUID] = Field(None, title="League ID")


# Nested schema - for use in other models


class TeamNested(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    team_id: UUID = Field(..., title="Team ID")
    team_name: str = Field(..., title="Team Name")


# Schema with stats - for team overview


class TeamWithStats(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    team_id: UUID = Field(..., title="Team ID")
    team_name: str = Field(..., title="Team Name")
    league_id: UUID = Field(..., title="League ID")
    created_at: datetime = Field(..., title="Date Created")

    # Stats (computed fields)
    active_player_count: int = Field(..., title="Active Players")
    total_player_count: int = Field(..., title="Total Players")
    match_count: int = Field(..., title="Total Matches")
