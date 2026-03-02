"""
Structured logging with tenant context
Per article: Per-tenant resource usage metrics, tenant tagging in logs
"""

import logging
import sys
from contextvars import ContextVar

from app.core.tenant import tenant_id_context, tenant_slug_context

# Context for request correlation
request_id_context: ContextVar[str | None] = ContextVar("request_id", default=None)


class TenantContextFilter(logging.Filter):
    """Add tenant_id and tenant_slug to log records."""

    def filter(self, record: logging.LogRecord) -> bool:
        record.tenant_id = tenant_id_context.get() or ""
        record.tenant_slug = tenant_slug_context.get() or ""
        record.request_id = request_id_context.get() or ""
        return True


def setup_logging() -> None:
    """Configure structured logging with tenant context."""
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | tenant=%(tenant_id)s | %(message)s"
    )
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    handler.addFilter(TenantContextFilter())

    logger = logging.getLogger("app")
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)
    logger.propagate = False
