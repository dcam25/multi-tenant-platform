"""
Tenant context middleware
Per article: RBAC and tenant context enforcement - double-boundary checking
Sets tenant context from X-Tenant-ID / X-Tenant-Slug for downstream use.
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.tenant import set_tenant_context


class TenantContextMiddleware(BaseHTTPMiddleware):
    """Extract tenant from headers and set context for request lifecycle."""

    async def dispatch(self, request: Request, call_next):
        tenant_id = request.headers.get("X-Tenant-ID")
        tenant_slug = request.headers.get("X-Tenant-Slug")

        if tenant_id or tenant_slug:
            set_tenant_context(tenant_id=tenant_id, tenant_slug=tenant_slug)

        response = await call_next(request)
        return response
