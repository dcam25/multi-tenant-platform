"""
Tenant config caching via Redis
Per article: Tenant IDs in every cache key, keys structured in hierarchies
"""

import json

from app.core.redis import redis_client

CACHE_PREFIX = "tenant"
CACHE_TTL = 300  # 5 minutes


def _cache_key(tenant_id: str, suffix: str = "config") -> str:
    """Tenant-aware cache key: tenant:{id}:{suffix}"""
    return f"{CACHE_PREFIX}:{tenant_id}:{suffix}"


async def get_tenant_config_cached(tenant_id: str) -> dict | None:
    """Get tenant config from cache. Returns None if miss."""
    key = _cache_key(tenant_id)
    val = await redis_client.get(key)
    if val:
        try:
            return json.loads(val)
        except json.JSONDecodeError:
            return None
    return None


async def set_tenant_config_cached(tenant_id: str, config: dict) -> None:
    """Cache tenant config with TTL."""
    key = _cache_key(tenant_id)
    await redis_client.set(key, json.dumps(config), ex=CACHE_TTL)


async def invalidate_tenant_config(tenant_id: str) -> None:
    """Invalidate cached config when tenant is updated."""
    key = _cache_key(tenant_id)
    await redis_client.delete(key)
