"""
RBAC - Role-Based Access Control
Roles: admin, manager, member, viewer
"""

from enum import Enum
from fastapi import HTTPException, status


class Role(str, Enum):
    """User roles with hierarchical permissions."""

    ADMIN = "admin"
    MANAGER = "manager"
    MEMBER = "member"
    VIEWER = "viewer"


# Permission definitions per resource
PERMISSIONS = {
    "users": {
        Role.ADMIN: ["create", "read", "update", "delete"],
        Role.MANAGER: ["create", "read", "update"],
        Role.MEMBER: ["read", "update"],
        Role.VIEWER: ["read"],
    },
    "tenants": {
        Role.ADMIN: ["create", "read", "update", "delete"],
        Role.MANAGER: ["read", "update"],
        Role.MEMBER: ["read"],
        Role.VIEWER: ["read"],
    },
    "settings": {
        Role.ADMIN: ["create", "read", "update", "delete"],
        Role.MANAGER: ["read", "update"],
        Role.MEMBER: ["read"],
        Role.VIEWER: ["read"],
    },
    "analytics": {
        Role.ADMIN: ["create", "read", "update", "delete"],
        Role.MANAGER: ["read"],
        Role.MEMBER: ["read"],
        Role.VIEWER: ["read"],
    },
}


def check_permission(role: str, resource: str, action: str) -> bool:
    """Check if role has permission for resource action."""
    try:
        role_enum = Role(role)
    except ValueError:
        return False

    resource_perms = PERMISSIONS.get(resource, {})
    allowed_actions = resource_perms.get(role_enum, [])

    return action in allowed_actions


def require_permission(resource: str, action: str):
    """Decorator/dependency to require permission."""

    def permission_checker(role: str):
        if not check_permission(role, resource, action):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions: {resource}:{action}",
            )
        return True

    return permission_checker
