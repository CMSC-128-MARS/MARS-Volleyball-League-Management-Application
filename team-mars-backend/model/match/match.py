from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from model.team.team import TeamSimple, TeamNested
    from model.match_team_stats.match_team_stats import MatchTeamStatsNested
    from model.league.league import LeagueSimple, LeagueNested


# Full schema - with all relationships (for detailed responses)


class MatchFull(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    match_id: UUID = Field(..., title="Match ID")
    match_date: datetime = Field(..., title="Match Date")
    location: str = Field(..., title="Location")
    created_at: datetime = Field(..., title="Created At")
    is_completed: Optional[bool] = Field(None, title="Is Completed?")

    # Relationships
    league: Optional["LeagueNested"] = Field(None, title="League")
    team1: Optional["TeamNested"] = Field(None, title="Team 1")
    team2: Optional["TeamNested"] = Field(None, title="Team 2")
    team_stats: Optional[List["MatchTeamStatsNested"]] = Field(
        None, title="Team Statistics"
    )

    @property
    def matchup(self) -> str:
        """Get formatted matchup string"""
        if self.team1 and self.team2:
            return f"{self.team1.team_name} vs {self.team2.team_name}"
        return "TBD vs TBD"

    @property
    def winner(self) -> Optional[TeamSimple]:
        """Get the winning team"""
        if self.team_stats:
            for stat in self.team_stats:
                if stat.is_winner and stat.team:
                    return stat.team
        return None

    @property
    def score_summary(self) -> Optional[str]:
        """Get score summary"""
        if self.team_stats and len(self.team_stats) == 2:
            team1_stat = next(
                (
                    s
                    for s in self.team_stats
                    if s.team and s.team.team_id == self.team1_id
                ),
                None,
            )
            team2_stat = next(
                (
                    s
                    for s in self.team_stats
                    if s.team and s.team.team_id == self.team2_id
                ),
                None,
            )

            if (
                team1_stat
                and team2_stat
                and team1_stat.sets_won is not None
                and team2_stat.sets_won is not None
            ):
                return f"{team1_stat.sets_won}-{team2_stat.sets_won}"
        return None


# Simple schema - without relationships (for basic responses)


class MatchSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    match_id: UUID = Field(..., title="Match ID")
    league_id: UUID = Field(..., title="League ID")
    team1_id: UUID = Field(..., title="Team 1 ID")
    team2_id: UUID = Field(..., title="Team 2 ID")
    match_date: datetime = Field(..., title="Match Date")
    location: str = Field(..., title="Location")
    created_at: datetime = Field(..., title="Created At")
    is_completed: bool = Field(..., title="Is Completed?")


# Base schema - for creation


class MatchCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    league_id: UUID = Field(..., title="League ID", description="ID of the league")
    team1_id: UUID = Field(..., title="Team 1 ID", description="ID of the first team")
    team2_id: UUID = Field(..., title="Team 2 ID", description="ID of the second team")
    match_date: datetime = Field(
        ..., title="Match Date", description="Date and time of the match"
    )
    location: str = Field(
        ..., title="Location", max_length=200, description="Match location"
    )


# Base schema - for updates


class MatchUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    match_date: Optional[datetime] = Field(None, title="Match Date")
    location: Optional[str] = Field(None, title="Location", max_length=200)
    league_id: Optional[UUID] = Field(None, title="League ID")
    is_completed: bool = Field(..., title="Is Completed?")


# Schema with team names (useful for lists)


class MatchWithTeams(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    match_id: UUID = Field(..., title="Match ID")
    match_date: datetime = Field(..., title="Match Date")
    location: str = Field(..., title="Location")
    is_completed: bool = Field(..., title="Is Completed?")

    # Relationships
    team1: Optional[TeamNested] = Field(None, title="Team 1")
    team2: Optional[TeamNested] = Field(None, title="Team 2")
    league: Optional[LeagueNested] = Field(None, title="League")

    @property
    def matchup(self) -> str:
        """Get formatted matchup string"""
        if self.team1 and self.team2:
            return f"{self.team1.team_name} vs {self.team2.team_name}"
        return "TBD vs TBD"


# Nested schema - for use in other models


class MatchNested(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    match_id: UUID = Field(..., title="Match ID")
    match_date: datetime = Field(..., title="Match Date")
    location: str = Field(..., title="Location")
    team1: Optional[TeamSimple] = Field(None, title="Team 1")
    team2: Optional[TeamSimple] = Field(None, title="Team 2")
    is_completed: bool = Field(..., title="Is Completed?")
