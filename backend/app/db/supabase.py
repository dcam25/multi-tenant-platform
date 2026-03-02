"""
Supabase client for multi-tenant database
Single database with tenant_id columns (pool isolation)
"""

from supabase import create_client, Client

from app.core.config import settings


def get_supabase() -> Client:
    """Get Supabase client."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


def get_tenant_scope(tenant_id: str) -> dict:
    """Return tenant-scoped filter for RLS or queries."""
    return {"tenant_id": tenant_id}
