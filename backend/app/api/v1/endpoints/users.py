"""
User management endpoints
RBAC protected - requires appropriate role
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter()


class UserResponse(BaseModel):
    """User response schema."""

    id: str
    email: str
    name: str
    role: str
    tenant_id: str | None = None


class UserListResponse(BaseModel):
    """Paginated user list."""

    users: list[UserResponse]
    total: int
    page: int
    page_size: int


@router.get(
    "",
    response_model=UserListResponse,
    summary="List users",
    description="Get paginated list of users. Requires users:read permission.",
)
async def list_users(page: int = 1, page_size: int = 20):
    """List users with pagination."""
    return UserListResponse(
        users=[],
        total=0,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get user by ID",
    description="Get single user. Requires users:read permission.",
)
async def get_user(user_id: str):
    """Get user by ID."""
    raise HTTPException(status_code=404, detail="User not found")
