import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    # Environment
    STAGE: str = "development"
    ENVIRONMENT: str = "development"

    # Project
    PROJECT_NAME: str = "Team MARS API"
    CONTACT_EMAIL: str = "contact@example.com"

    # Database - Support both naming conventions
    DATABASE_URL: Optional[str] = None
    SUPABASE_URL: Optional[str] = None

    # Supabase Keys (optional - only if you use Supabase features)
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=(
            f".env.{os.getenv('STAGE', 'development')}"
            if os.path.exists(f".env.{os.getenv('STAGE', 'development')}")
            else ".env"
        ),
        case_sensitive=True,
        extra="ignore",
    )

    def get_database_url(self) -> str:
        """
        Get database URL, prioritizing DATABASE_URL over SUPABASE_URL
        """
        if self.DATABASE_URL:
            return self.DATABASE_URL
        elif self.SUPABASE_URL:
            return self.SUPABASE_URL
        else:
            raise ValueError("Either DATABASE_URL or SUPABASE_URL must be set")


@lru_cache
def get_settings() -> Settings:
    """
    Cached settings instance to avoid re-reading env files.
    """
    return Settings()
