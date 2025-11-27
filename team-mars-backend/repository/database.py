from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from typing import Generator
from constants.settings import get_settings

SETTINGS = get_settings()

# SQLAlchemy engine and session

engine = create_engine(SETTINGS.DATABASE_URL, echo=False)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()
