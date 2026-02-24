"""
Multi-Tenant Platform - FastAPI Backend
RESTful API with Swagger UI, Redis, Supabase
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.redis import redis_client
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    await redis_client.connect()
    yield
    await redis_client.disconnect()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
    ## Multi-Tenant Platform API
    
    RESTful API with:
    - **RBAC** - Role-based access control
    - **Supabase** - PostgreSQL database
    - **Redis** - Caching & session storage
    - **WebSocket** - Real-time notifications
    
    ### Authentication
    All protected endpoints require `Authorization: Bearer <token>` header.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    redis_ok = await redis_client.ping()
    return {
        "status": "healthy",
        "redis": "connected" if redis_ok else "disconnected",
    }
