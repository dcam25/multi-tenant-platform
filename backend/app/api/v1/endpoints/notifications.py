"""
Notification endpoints
Real-time notifications - connect via WebSocket/Socket.io
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class NotificationResponse(BaseModel):
    """Notification schema."""

    id: str
    type: str
    title: str
    message: str
    read: bool
    created_at: str


@router.get(
    "",
    summary="List notifications",
    description="Get user notifications. Real-time updates via WebSocket.",
)
async def list_notifications():
    """List notifications - real-time via Socket.io on frontend."""
    return {"notifications": []}
