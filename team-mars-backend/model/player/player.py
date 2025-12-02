from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List, Any
from uuid import UUID

# Full schema - with relationships (for detailed responses)


class PlayerFull(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    player_id: UUID = Field(..., title="Player ID")
    first_name: str = Field(..., title="First Name")
    last_name: Optional[str] = Field(None, title="Last Name")

    jersey_number: Optional[int] = Field(None, title="Jersey Number")
    default_position: Optional[str] = Field(None, title="Default Position")
    created_at: datetime = Field(..., title="Date Created")

    # Relationships - using Any to avoid circular imports, will be resolved at runtime
    skills: Optional[List[Any]] = Field(None, title="Player Skills")
    team_memberships: Optional[List[Any]] = Field(None, title="Team Memberships")


# Base Schema - for basic responses


class PlayerSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    player_id: UUID = Field(..., title="Player ID")
    first_name: str = Field(..., title="First Name")
    last_name: Optional[str] = Field(None, title="Last Name")
    jersey_number: Optional[int] = Field(None, title="Jersey Number")
    default_position: Optional[str] = Field(None, title="Default Position")
    created_at: datetime = Field(..., title="Date Created")


# Base schema - for creation (no IDs, no relationships)


class PlayerCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    first_name: str = Field(..., title="First Name", max_length=100)
    last_name: Optional[str] = Field(None, title="Last Name", max_length=100)
    jersey_number: Optional[int] = Field(None, title="Jersey Number", ge=0, le=999)
    default_position: Optional[str] = Field(
        None, title="Default Position", max_length=50
    )


# Base schema - for updates


class PlayerUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    first_name: Optional[str] = Field(None, title="First Name", max_length=100)
    last_name: Optional[str] = Field(None, title="Last Name", max_length=100)
    jersey_number: Optional[int] = Field(None, title="Jersey Number", ge=0, le=999)
    default_position: Optional[str] = Field(
        None, title="Default Position", max_length=50
    )
