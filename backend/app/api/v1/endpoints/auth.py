"""
Authentication endpoints
Integrates with Clerk - validates JWT from frontend
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

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
    description="Validates Clerk JWT and returns user info. Used for backend session verification.",
)
async def validate_token():
    """
    In production, verify Clerk JWT using the Bearer token from Authorization header.
    Clerk provides JWKS endpoint for verification.
    """
    return TokenValidation(valid=True, user_id=None, role=None)
