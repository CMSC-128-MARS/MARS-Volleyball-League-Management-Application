from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from uuid import UUID

if TYPE_CHECKING:
    from model.team.team import TeamNested
    from model.match.match import MatchNested


# Base class with all common fields and properties
class LeagueBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    league_id: UUID = Field(..., title="League ID")
    league_name: str = Field(..., title="League Name")
    start_date: datetime = Field(..., title="Start Date")
    end_date: Optional[datetime] = Field(None, title="End Date")
    location: str = Field(..., title="Location")
    description: Optional[str] = Field(None, title="Description")

    @property
    def is_active(self) -> bool:
        """Check if league is currently active"""
        now = datetime.utcnow()
        if self.end_date:
            return self.start_date <= now <= self.end_date
        return self.start_date <= now

    @property
    def status(self) -> str:
        """Get league status"""
        now = datetime.utcnow()
        if now < self.start_date:
            return "upcoming"
        elif self.end_date and now > self.end_date:
            return "completed"
        else:
            return "active"


# Full schema - with relationships (for detailed responses)


# Full schema - adds relationships and additional properties
class LeagueFull(LeagueBase):
    """League with relationships"""

    # Relationships
    teams: Optional[List["TeamNested"]] = Field(None, title="Teams")
    matches: Optional[List["MatchNested"]] = Field(None, title="Matches")

    @property
    def team_count(self) -> int:
        """Get number of teams in league"""
        return len(self.teams) if self.teams else 0

    @property
    def match_count(self) -> int:
        """Get number of matches in league"""
        return len(self.matches) if self.matches else 0


# Simple schema - without relationships (for basic responses)


# Simple schema - just inherits the base
class LeagueSimple(LeagueBase):
    """League without relationships"""

    pass


# Base schema - for creation
class LeagueCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    league_name: str = Field(
        ...,
        title="League Name",
        max_length=100,
        min_length=1,
        description="Name of the league",
    )
    start_date: datetime = Field(
        ..., title="Start Date", description="League start date"
    )
    end_date: Optional[datetime] = Field(
        None, title="End Date", description="League end date"
    )
    location: str = Field(
        ...,
        title="Location",
        max_length=200,
        description="Primary location of the league",
    )
    description: Optional[str] = Field(
        None, title="Description", max_length=1000, description="League description"
    )

    @field_validator("end_date")
    @classmethod
    def validate_end_date(cls, v: Optional[datetime], info) -> Optional[datetime]:
        if v is not None and "start_date" in info.data:
            start_date = info.data["start_date"]
            if v <= start_date:
                raise ValueError("End date must be after start date")
        return v


# Base schema - for updates


class LeagueUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    league_name: Optional[str] = Field(
        None, title="League Name", max_length=100, min_length=1
    )
    start_date: Optional[datetime] = Field(None, title="Start Date")
    end_date: Optional[datetime] = Field(None, title="End Date")
    location: Optional[str] = Field(None, title="Location", max_length=200)
    description: Optional[str] = Field(None, title="Description", max_length=1000)


# Nested schema - for use in other models


class LeagueNested(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    league_id: UUID = Field(..., title="League ID")
    league_name: str = Field(..., title="League Name")
    location: str = Field(..., title="Location")


# Schema with stats - for league overview


class LeagueWithStats(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    league_id: UUID = Field(..., title="League ID")
    league_name: str = Field(..., title="League Name")
    start_date: datetime = Field(..., title="Start Date")
    end_date: Optional[datetime] = Field(None, title="End Date")
    location: str = Field(..., title="Location")
    description: Optional[str] = Field(None, title="Description")

    # Stats (computed fields)
    team_count: int = Field(..., title="Number of Teams")
    match_count: int = Field(..., title="Number of Matches")
    completed_match_count: int = Field(..., title="Completed Matches")
    status: str = Field(..., title="League Status")
