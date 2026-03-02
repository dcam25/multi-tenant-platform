"""
Tenant management endpoints
Multi-tenant resource isolation - per article: tenant isolation, config, onboarding
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.auth import AuthInfo, get_current_user
from app.core.tenant_cache import invalidate_tenant_config
from app.db.supabase import get_supabase

router = APIRouter()


class TenantResponse(BaseModel):
    """Tenant response schema."""

    id: str
    name: str
    slug: str
    plan: str
    config: dict | None = None


class TenantCreate(BaseModel):
    """Create tenant (onboarding)."""

    name: str
    slug: str
    plan: str = "free"


class TenantConfigUpdate(BaseModel):
    """Update tenant configuration."""

    branding: dict | None = None
    features: dict | None = None
    settings: dict | None = None


class TenantListResponse(BaseModel):
    """Paginated tenant list."""

    tenants: list[TenantResponse]
    total: int


def _tenant_from_row(row: dict) -> TenantResponse:
    return TenantResponse(
        id=str(row["id"]),
        name=row["name"],
        slug=row["slug"],
        plan=row["plan"],
        config=row.get("config") or {},
    )


@router.post(
    "",
    response_model=TenantResponse,
    summary="Create tenant (onboarding)",
    description="Tenant onboarding - create new tenant/organization.",
)
async def create_tenant(
    data: TenantCreate,
    auth: Annotated[AuthInfo, Depends(get_current_user)],
):
    """Create tenant and add creator as admin. Persists to Supabase."""
    supabase = get_supabase()

    # Check slug uniqueness
    existing = supabase.table("tenants").select("id").eq("slug", data.slug).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug already taken",
        )

    # Insert tenant
    tenant_row = (
        supabase.table("tenants")
        .insert(
            {
                "name": data.name,
                "slug": data.slug,
                "plan": data.plan,
                "config": {},
            }
        )
        .execute()
    )

    if not tenant_row.data or len(tenant_row.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create tenant",
        )

    tenant = tenant_row.data[0]
    tenant_id = str(tenant["id"])

    # Add creator as admin
    supabase.table("tenant_users").insert(
        {
            "tenant_id": tenant_id,
            "user_id": auth.sub,
            "role": "admin",
        }
    ).execute()

    return _tenant_from_row(tenant)


@router.get(
    "/me",
    response_model=TenantListResponse,
    summary="List tenants for current user",
    description="Get tenants the authenticated user belongs to.",
)
async def list_my_tenants(
    auth: Annotated[AuthInfo, Depends(get_current_user)],
):
    """List tenants for current user via tenant_users join."""
    supabase = get_supabase()

    memberships = (
        supabase.table("tenant_users")
        .select("tenant_id")
        .eq("user_id", auth.sub)
        .execute()
    )

    if not memberships.data or len(memberships.data) == 0:
        return TenantListResponse(tenants=[], total=0)

    tenant_ids = [m["tenant_id"] for m in memberships.data]

    tenants_result = (
        supabase.table("tenants")
        .select("*")
        .in_("id", tenant_ids)
        .execute()
    )

    tenants = [_tenant_from_row(t) for t in (tenants_result.data or [])]
    return TenantListResponse(tenants=tenants, total=len(tenants))


@router.get(
    "/{tenant_id}",
    response_model=TenantResponse,
    summary="Get tenant",
    description="Get tenant by ID. Requires tenant membership.",
)
async def get_tenant(
    tenant_id: str,
    auth: Annotated[AuthInfo, Depends(get_current_user)],
):
    """Get tenant by ID. Verifies user is member."""
    supabase = get_supabase()

    # Verify membership
    membership = (
        supabase.table("tenant_users")
        .select("tenant_id")
        .eq("tenant_id", tenant_id)
        .eq("user_id", auth.sub)
        .execute()
    )

    if not membership.data or len(membership.data) == 0:
        raise HTTPException(status_code=404, detail="Tenant not found")

    tenant_result = supabase.table("tenants").select("*").eq("id", tenant_id).execute()

    if not tenant_result.data or len(tenant_result.data) == 0:
        raise HTTPException(status_code=404, detail="Tenant not found")

    return _tenant_from_row(tenant_result.data[0])


@router.patch(
    "/{tenant_id}/config",
    response_model=TenantResponse,
    summary="Update tenant config",
    description="Tenant-specific configuration: branding, features, settings.",
)
async def update_tenant_config(
    tenant_id: str,
    data: TenantConfigUpdate,
    auth: Annotated[AuthInfo, Depends(get_current_user)],
):
    """Update tenant configuration. Requires admin/manager role."""
    supabase = get_supabase()

    # Verify membership and role
    membership = (
        supabase.table("tenant_users")
        .select("role")
        .eq("tenant_id", tenant_id)
        .eq("user_id", auth.sub)
        .execute()
    )

    if not membership.data or len(membership.data) == 0:
        raise HTTPException(status_code=404, detail="Tenant not found")

    role = membership.data[0].get("role", "")
    if role not in ("admin", "manager"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    config = {}
    if data.branding is not None:
        config["branding"] = data.branding
    if data.features is not None:
        config["features"] = data.features
    if data.settings is not None:
        config["settings"] = data.settings

    supabase.table("tenants").update({"config": config}).eq("id", tenant_id).execute()
    await invalidate_tenant_config(tenant_id)

    tenant_result = supabase.table("tenants").select("*").eq("id", tenant_id).execute()
    if not tenant_result.data:
        raise HTTPException(status_code=404, detail="Tenant not found")

    return _tenant_from_row(tenant_result.data[0])
