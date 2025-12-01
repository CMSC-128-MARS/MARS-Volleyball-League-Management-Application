from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set!")

# ------------------------------
# Synchronous engine (classic)
# ------------------------------
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    echo=True,
    future=True,
    connect_args={"statement_cache_size": 0},
)
Base = declarative_base()

# ------------------------------
# Async engine (for async routes)
# ------------------------------
ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=True,
    connect_args={"statement_cache_size": 0},
)
async_session_maker = sessionmaker(
    bind=async_engine, expire_on_commit=False, class_=AsyncSession
)


# Dependency for FastAPI async routes
async def get_async_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session
