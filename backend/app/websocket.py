"""
WebSocket server for real-time notifications
Uses python-socketio (Socket.io protocol)
"""

import socketio

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
)

# In production, mount with: app.mount("/socket.io", socketio_app)


async def send_notification(user_id: str, notification: dict):
    """Send notification to specific user."""
    await sio.emit("notification", notification, room=user_id)


@sio.event
async def connect(sid, environ, auth):
    """Client connects - join room by user_id."""
    user_id = auth.get("userId") if auth else None
    if user_id:
        await sio.save_session(sid, {"user_id": user_id})
        await sio.enter_room(sid, user_id)


@sio.event
async def disconnect(sid):
    """Client disconnects."""
    pass
