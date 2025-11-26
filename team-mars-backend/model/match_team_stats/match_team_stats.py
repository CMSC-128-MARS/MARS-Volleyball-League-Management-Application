from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime
from typing import Optional
from uuid import UUID
from model.team.team import TeamSimple
from model.match.match import MatchSimple

# Full schema - with relationships (for detailed responses)


class MatchTeamStatsFull(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    match_team_stats_id: UUID = Field(..., title="Match Team Stats ID")
    match_id: UUID = Field(..., title="Match ID")
    team_id: UUID = Field(..., title="Team ID")
    total_score: Optional[int] = Field(None, title="Total Score")
    sets_won: Optional[int] = Field(None, title="Sets Won")
    sets_lost: Optional[int] = Field(None, title="Sets Lost")
    is_winner: Optional[bool] = Field(None, title="Is Winner")

    # Relationships
    match: Optional[MatchSimple] = Field(None, title="Match")
    team: Optional[TeamSimple] = Field(None, title="Team")

    @property
    def total_sets(self) -> Optional[int]:
        """Get total sets played"""
        if self.sets_won is not None and self.sets_lost is not None:
            return self.sets_won + self.sets_lost
        return None

    @property
    def win_percentage(self) -> Optional[float]:
        """Get set win percentage"""

        total = self.total_sets
        if total and total > 0 and self.sets_won is not None:
            return round((self.sets_won / total) * 100, 2)
        return None

    @property
    def result_summary(self) -> str:
        """Get a summary of the match result"""
        if self.is_winner:
            return f"Won {self.sets_won}-{self.sets_lost}"
        elif self.is_winner is False:
            return f"Lost {self.sets_won}-{self.sets_lost}"
        return "Result pending"


# Simple schema - without relationships (for basic responses)


class MatchTeamStatsSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    match_team_stats_id: UUID = Field(..., title="Match Team Stats ID")
    match_id: UUID = Field(..., title="Match ID")
    team_id: UUID = Field(..., title="Team ID")
    total_score: Optional[int] = Field(None, title="Total Score")
    sets_won: Optional[int] = Field(None, title="Sets Won")
    sets_lost: Optional[int] = Field(None, title="Sets Lost")
    is_winner: Optional[bool] = Field(None, title="Is Winner")

    @property
    def total_sets(self) -> Optional[int]:
        """Get total sets played"""
        if self.sets_won is not None and self.sets_lost is not None:
            return self.sets_won + self.sets_lost
        return None

    @property
    def win_percentage(self) -> Optional[float]:
        """Get set win percentage"""
        total = self.total_sets
        if total and total > 0 and self.sets_won is not None:
            return round((self.sets_won / total) * 100, 2)
        return None


# Base schema - for creation


class MatchTeamStatsCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    match_id: UUID = Field(..., title="Match ID", description="ID of the match")
    team_id: UUID = Field(..., title="Team ID", description="ID of the team")
    total_score: Optional[int] = Field(
        None, title="Total Score", ge=0, description="Total points scored"
    )
    sets_won: Optional[int] = Field(
        None, title="Sets Won", ge=0, description="Number of sets won"
    )

    sets_lost: Optional[int] = Field(
        None, title="Sets Lost", ge=0, description="Number of sets lost"
    )
    is_winner: Optional[bool] = Field(
        None, title="Is Winner", description="Whether this team won the match"
    )

    @field_validator("sets_won", "sets_lost")
    @classmethod
    def validate_sets(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:

            raise ValueError("Sets cannot be negative")
        return v

    @field_validator("total_score")
    @classmethod
    def validate_score(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("Score cannot be negative")
        return v


# Base schema - for updates


class MatchTeamStatsUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    total_score: Optional[int] = Field(None, title="Total Score", ge=0)

    sets_won: Optional[int] = Field(None, title="Sets Won", ge=0)
    sets_lost: Optional[int] = Field(None, title="Sets Lost", ge=0)

    is_winner: Optional[bool] = Field(None, title="Is Winner")

    @field_validator("sets_won", "sets_lost")
    @classmethod
    def validate_sets(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("Sets cannot be negative")

        return v

    @field_validator("total_score")
    @classmethod
    def validate_score(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("Score cannot be negative")
        return v


# Nested schema - for use in other models
class MatchTeamStatsNested(BaseModel):

    model_config = ConfigDict(from_attributes=True, extra="ignore")

    match_team_stats_id: UUID = Field(..., title="Match Team Stats ID")
    total_score: Optional[int] = Field(None, title="Total Score")
    sets_won: Optional[int] = Field(None, title="Sets Won")

    sets_lost: Optional[int] = Field(None, title="Sets Lost")
    is_winner: Optional[bool] = Field(None, title="Is Winner")
    team: Optional[TeamSimple] = Field(None, title="Team")
