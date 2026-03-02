"""
Logto JWT validation for FastAPI
Per Logto docs: https://docs.logto.io/api-protection/python/fastapi
Validates access tokens via JWKS, extracts user and tenant context.
"""

from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from app.core.config import settings


class AuthInfo:
    """Authenticated user info from JWT."""

    def __init__(
        self,
        sub: str,
        client_id: str | None = None,
        organization_id: str | None = None,
        scopes: list[str] | None = None,
        audience: list[str] | None = None,
    ):
        self.sub = sub
        self.client_id = client_id
        self.organization_id = organization_id
        self.scopes = scopes or []
        self.audience = audience or []


class AuthorizationError(Exception):
    def __init__(self, message: str, status_code: int = 401):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


def _get_jwks_client() -> PyJWKClient:
    endpoint = (settings.LOGTO_ENDPOINT or "").rstrip("/")
    jwks_uri = f"{endpoint}/oidc/jwks"
    return PyJWKClient(jwks_uri)


def _validate_jwt(token: str) -> dict:
    """Validate Logto JWT and return payload."""
    if not settings.LOGTO_ENDPOINT:
        # Dev fallback: decode without verification when Logto not configured
        try:
            return jwt.decode(token, options={"verify_signature": False})
        except Exception:
            raise AuthorizationError("Invalid token", 401)

    endpoint = settings.LOGTO_ENDPOINT.rstrip("/")
    issuer = f"{endpoint}/oidc"

    try:
        jwks_client = _get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=issuer,
            options={"verify_aud": False},
        )
        return payload
    except jwt.InvalidTokenError as e:
        raise AuthorizationError(f"Invalid token: {str(e)}", 401)
    except Exception as e:
        raise AuthorizationError(f"Token validation failed: {str(e)}", 401)


def create_auth_info(payload: dict) -> AuthInfo:
    """Create AuthInfo from JWT payload."""
    scopes = payload.get("scope", "")
    scopes_list = scopes.split() if isinstance(scopes, str) else (scopes or [])
    audience = payload.get("aud", [])
    if isinstance(audience, str):
        audience = [audience]

    return AuthInfo(
        sub=payload.get("sub", ""),
        client_id=payload.get("client_id"),
        organization_id=payload.get("organization_id"),
        scopes=scopes_list,
        audience=audience,
    )


security = HTTPBearer(auto_error=False)


async def get_current_user_optional(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)] = None,
) -> AuthInfo | None:
    """Get current user from JWT if present. Returns None if no token."""
    if not credentials:
        return None

    try:
        payload = _validate_jwt(credentials.credentials)
        return create_auth_info(payload)
    except AuthorizationError:
        return None


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)] = None,
) -> AuthInfo:
    """Require valid JWT. Raises 401 if missing or invalid."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required",
        )

    try:
        payload = _validate_jwt(credentials.credentials)
        return create_auth_info(payload)
    except AuthorizationError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message,
        )
