from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional
from uuid import UUID
from model.team.team import TeamSimple
from model.match.match import MatchSimple

# Full schema - with relationships (for detailed responses)


class MatchTeamStatsFull(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    match_team_stats_id: UUID = Field(..., title="Match Team Stats ID")
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


# Base schema - for updates


class MatchTeamStatsUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    total_score: Optional[int] = Field(None, title="Total Score", ge=0)

    sets_won: Optional[int] = Field(None, title="Sets Won", ge=0)
    sets_lost: Optional[int] = Field(None, title="Sets Lost", ge=0)

    is_winner: Optional[bool] = Field(None, title="Is Winner")


# Nested schema - for use in other models
class MatchTeamStatsNested(BaseModel):

    model_config = ConfigDict(from_attributes=True, extra="ignore")

    match_team_stats_id: UUID = Field(..., title="Match Team Stats ID")
    total_score: Optional[int] = Field(None, title="Total Score")
    sets_won: Optional[int] = Field(None, title="Sets Won")

    sets_lost: Optional[int] = Field(None, title="Sets Lost")
    is_winner: Optional[bool] = Field(None, title="Is Winner")
    team: Optional[TeamSimple] = Field(None, title="Team")


# ============= NEW SCHEMAS FOR MATCH RESULTS =============


class FinalScores(BaseModel):
    """Final scores for both teams"""

    team1_name: str
    team1_total_score: int
    team2_name: str
    team2_total_score: int


class FinalSets(BaseModel):
    """Final sets for both teams"""

    team1_sets_won: int
    team2_sets_won: int


class MatchResultsSummary(BaseModel):
    """Summary of match results with both teams"""

    final_scores: FinalScores
    final_sets: FinalSets

    @property
    def winner(self) -> str:
        """Determine the winner based on sets won"""
        if self.final_sets.team1_sets_won > self.final_sets.team2_sets_won:
            return self.final_scores.team1_name
        elif self.final_sets.team2_sets_won > self.final_sets.team1_sets_won:
            return self.final_scores.team2_name
        return "Draw"

    @property
    def is_complete(self) -> bool:
        """Check if match has a definitive winner"""
        return self.final_sets.team1_sets_won != self.final_sets.team2_sets_won


class TeamStatsUpdate(BaseModel):
    """Stats update for a single team"""

    total_score: Optional[int] = Field(None, ge=0, description="Total points scored")
    sets_won: Optional[int] = Field(None, ge=0, description="Number of sets won")
    sets_lost: Optional[int] = Field(None, ge=0, description="Number of sets lost")

    @field_validator("sets_won", "sets_lost")
    @classmethod
    def validate_sets_together(cls, v, info):
        """Ensure sets_won and sets_lost are consistent"""
        # This validator runs for each field, so we need to check context
        return v


class MatchResultsUpdate(BaseModel):
    """Update payload for match results (both teams)"""

    model_config = ConfigDict(extra="forbid")

    team1_id: UUID = Field(..., description="ID of first team")
    team1_stats: TeamStatsUpdate = Field(..., description="Stats for first team")
    team2_id: UUID = Field(..., description="ID of second team")
    team2_stats: TeamStatsUpdate = Field(..., description="Stats for second team")

    @field_validator("team2_id")
    @classmethod
    def validate_different_teams(cls, v, info):
        """Ensure team1_id and team2_id are different"""
        if "team1_id" in info.data and v == info.data["team1_id"]:
            raise ValueError("team1_id and team2_id must be different")
        return v

    def model_post_init(self, __context):
        """Additional validation after model is initialized"""
        # Validate that if sets are provided for one team, they should be for both
        team1_has_sets = (
            self.team1_stats.sets_won is not None
            or self.team1_stats.sets_lost is not None
        )
        team2_has_sets = (
            self.team2_stats.sets_won is not None
            or self.team2_stats.sets_lost is not None
        )

        if team1_has_sets != team2_has_sets:
            raise ValueError(
                "If sets are provided for one team, they must be provided for both teams"
            )

        # Validate sets_won and sets_lost are provided together for each team
        if self.team1_stats.sets_won is not None and self.team1_stats.sets_lost is None:
            raise ValueError("team1: sets_won and sets_lost must be provided together")
        if self.team1_stats.sets_lost is not None and self.team1_stats.sets_won is None:
            raise ValueError("team1: sets_won and sets_lost must be provided together")
        if self.team2_stats.sets_won is not None and self.team2_stats.sets_lost is None:
            raise ValueError("team2: sets_won and sets_lost must be provided together")
        if self.team2_stats.sets_lost is not None and self.team2_stats.sets_won is None:
            raise ValueError("team2: sets_won and sets_lost must be provided together")
