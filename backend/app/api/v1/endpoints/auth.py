"""
Authentication endpoints
Integrates with Logto - validates JWT from frontend
"""

from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.auth import AuthInfo, get_current_user

router = APIRouter()


class TokenValidation(BaseModel):
    """Token validation response."""

    valid: bool
    user_id: str | None = None
    role: str | None = None


@router.post(
    "/validate",
    response_model=TokenValidation,
    summary="Validate JWT token",
    description="Validates Logto JWT and returns user info. Used for backend session verification.",
)
async def validate_token(
    auth: Annotated[AuthInfo, Depends(get_current_user)],
):
    """Verify Logto JWT from Authorization header."""
    return TokenValidation(valid=True, user_id=auth.sub, role=None)
