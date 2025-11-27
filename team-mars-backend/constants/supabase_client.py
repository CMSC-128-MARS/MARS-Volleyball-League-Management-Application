"""
Supabase client configuration.
Provides both public and admin clients for different use cases.
"""

from supabase import create_client, Client
from functools import lru_cache
from config.settings import get_settings

SETTINGS = get_settings()


@lru_cache
def get_supabase_client() -> Client:
    """
    Get Supabase client with anon/public key.
    Use this for user-facing operations that respect RLS policies.
    """
    return create_client(SETTINGS.DATABASE_URL, SETTINGS.SUPABASE_KEY)


@lru_cache
def get_supabase_admin() -> Client:
    """
    Get Supabase client with service role key.
    Use this for admin operations that bypass RLS policies.
    WARNING: Use with caution - has full access to database.
    """

    return create_client(SETTINGS.DATABASE_URL, SETTINGS.SUPABASE_SERVICE_ROLE_KEY)


# Create instances for direct import if needed
supabase: Client = get_supabase_client()

supabase_admin: Client = get_supabase_admin()
