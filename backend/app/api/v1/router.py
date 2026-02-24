"""API v1 router - aggregates all endpoint modules."""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, tenants, notifications

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(tenants.router, prefix="/tenants", tags=["Tenants"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
