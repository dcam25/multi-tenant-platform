"""
Tenant context and isolation
Based on: Single multi-tenant database with tenant_id columns
Tenant identification: X-Tenant-ID header or X-Tenant-Slug header
"""

from contextvars import ContextVar
from typing import Annotated

from fastapi import Header, HTTPException, status

# Context variable for current tenant (set by middleware)
tenant_id_context: ContextVar[str | None] = ContextVar("tenant_id", default=None)
tenant_slug_context: ContextVar[str | None] = ContextVar("tenant_slug", default=None)


def get_current_tenant_id(
    x_tenant_id: Annotated[str | None, Header(alias="X-Tenant-ID")] = None,
    x_tenant_slug: Annotated[str | None, Header(alias="X-Tenant-Slug")] = None,
) -> str:
    """
    Resolve tenant from request headers.
    X-Tenant-ID takes precedence over X-Tenant-Slug.
    """
    tenant_id = tenant_id_context.get() or x_tenant_id
    tenant_slug = tenant_slug_context.get() or x_tenant_slug

    if tenant_id:
        return tenant_id
    if tenant_slug:
        # In production, would lookup tenant_id from slug via DB
        return tenant_slug

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Tenant context required. Provide X-Tenant-ID or X-Tenant-Slug header.",
    )


def get_tenant_id_optional() -> str | None:
    """Get tenant ID from context if set (for optional tenant-scoped routes)."""
    return tenant_id_context.get()


def set_tenant_context(tenant_id: str | None = None, tenant_slug: str | None = None):
    """Set tenant context (used by middleware)."""
    if tenant_id:
        tenant_id_context.set(tenant_id)
    if tenant_slug:
        tenant_slug_context.set(tenant_slug)
