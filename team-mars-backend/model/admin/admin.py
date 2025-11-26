from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from datetime import datetime
from typing import Optional, List
from uuid import UUID
import re
from model.player_skill.player_skill import PlayerSkillEvaluated


class AdminFull(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    admin_id: UUID = Field(..., title="Admin ID")
    username: str = Field(..., title="Admin Username")
    email: EmailStr = Field(..., title="Admin Email")
    created_at: datetime = Field(..., title="Date Created")

    # Relationships
    evaluated_skills: Optional[List[PlayerSkillEvaluated]] = Field(
        None, title="Evaluated Player Skills"
    )

    @property
    def evaluation_count(self) -> int:
        """Get number of player evaluations done by this admin"""
        return len(self.evaluated_skills) if self.evaluated_skills else 0


# Base schema - for creation (DEVELOPER/SYSTEM ONLY)


class AdminCreate(BaseModel):
    """
    Only for internal use by developers/system.
    NOT exposed to public API endpoints.

    """

    model_config = ConfigDict(extra="forbid")

    email: EmailStr = Field(
        ...,
        title="Admin Email",
        description="Email address for the admin (used for Cognito login)",
        example="admin@example.com",
    )
    username: str = Field(
        ...,
        title="Admin Username",
        description="Username for the admin",
        min_length=3,
        max_length=50,
        example="admin_mark",
    )

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        # Ensure username doesn't start with numbers
        if v and v[0].isdigit():
            raise ValueError("Username cannot start with a number")
        # Allow letters, underscores, and numbers (but not starting)
        if not re.match(r"^[a-zA-Z][a-zA-Z0-9_]*$", v):
            raise ValueError(
                "Username must start with a letter and contain only letters, numbers, and underscores"
            )
        return v


# Schema for syncing Cognito user to database


class AdminCognitoSync(BaseModel):
    """
    Used to sync admin from Cognito to database after Cognito user is created
    """

    model_config = ConfigDict(extra="forbid")

    cognito_sub: str = Field(
        ...,
        title="Cognito Sub",
        description="Cognito user sub (unique identifier from Cognito)",
    )
    email: EmailStr = Field(..., title="Admin Email")
    username: str = Field(..., title="Admin Username")


# Base schema - for updates (LIMITED)
class AdminUpdate(BaseModel):
    """
    Admins can only update their own profile with limited fields
    """

    model_config = ConfigDict(extra="forbid")

    username: Optional[str] = Field(
        None, title="Admin Username", min_length=3, max_length=50
    )

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: Optional[str]) -> Optional[str]:

        if v is not None:
            if not v:
                raise ValueError("Username cannot be empty")
            if v[0].isdigit():
                raise ValueError("Username cannot start with a number")
            if not re.match(r"^[a-zA-Z][a-zA-Z0-9_]*$", v):
                raise ValueError(
                    "Username must start with a letter and contain only letters, numbers, and underscores"
                )
        return v


# Simple schema - without relationships (for basic responses)


class AdminSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    admin_id: UUID = Field(
        ...,
        title="Admin ID",
        description="Unique identifier for an admin",
        example="123e4567-e89b-12d3-a456-426614174000",
    )

    username: str = Field(
        ...,
        title="Admin Username",
        description="Admin's username",
        example="admin_mark",
    )
    email: EmailStr = Field(
        ...,
        title="Admin Email",
        description="Admin's email used for authentication",
        example="admin@example.com",
    )
    created_at: datetime = Field(
        ..., title="Date created", description="Date the admin was created"
    )


# Full schema - with relationships


# Schema for admin profile (what admins see about themselves)


class AdminProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    admin_id: UUID = Field(..., title="Admin ID")
    username: str = Field(..., title="Username")
    email: EmailStr = Field(..., title="Email")
    created_at: datetime = Field(..., title="Member Since")
    evaluation_count: int = Field(..., title="Total Evaluations")
