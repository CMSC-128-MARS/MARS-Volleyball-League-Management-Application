from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from repository.db import get_db
from config.settings import get_settings

router = APIRouter(prefix="/health", tags=["Health"])


SETTINGS = get_settings()


@router.get("/")
def health_check():
    """Basic health check"""
    return {
        "status": "ok",
        "service": SETTINGS.PROJECT_NAME,
        "environment": SETTINGS.ENVIRONMENT,
    }


@router.get("/db")
def database_health_check(db: Session = Depends(get_db)):
    """
    Check database connection and return connection info
    """
    try:
        # Execute a simple query
        result = db.execute(text("SELECT 1"))
        result.fetchone()

        # Get current timestamp from database
        time_result = db.execute(text("SELECT NOW()"))
        db_time = time_result.fetchone()[0]

        # Get database version
        version_result = db.execute(text("SELECT version()"))
        db_version = version_result.fetchone()[0]

        # Get current database name
        db_name_result = db.execute(text("SELECT current_database()"))
        db_name = db_name_result.fetchone()[0]

        return {
            "status": "healthy",
            "database": "connected",
            "database_name": db_name,
            "database_time": str(db_time),
            # Just the first part
            "database_version": db_version.split(",")[0],
            "message": "Database connection successful",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e),
                "message": "Failed to connect to database",
            },
        )


@router.get("/db/tables")
def check_database_tables(db: Session = Depends(get_db)):
    """
    List all tables in the database to verify migrations
    """
    try:
        query = text(
            """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """
        )

        result = db.execute(query)

        tables = [row[0] for row in result.fetchall()]

        return {"status": "ok", "tables_count": len(tables), "tables": tables}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "error",
                "error": str(e),
                "message": "Failed to fetch database tables",
            },
        )


@router.get("/db/connection-info")
def database_connection_info():
    """
    Display database connection information (without sensitive data)
    """
    db_url = SETTINGS.DATABASE_URL

    # Parse connection string (hide password)
    if "@" in db_url:
        # Format: postgresql://user:password@host:port/database
        protocol_part = db_url.split("://")[0]
        remaining = db_url.split("://")[1]

        if "@" in remaining:
            credentials_part = remaining.split("@")[0]
            host_part = remaining.split("@")[1]

            username = (
                credentials_part.split(":")[0]
                if ":" in credentials_part
                else credentials_part
            )

            return {
                "status": "ok",
                "connection_info": {
                    "protocol": protocol_part,
                    "username": username,
                    "host": host_part.split("/")[0] if "/" in host_part else host_part,
                    "database": (
                        host_part.split("/")[1] if "/" in host_part else "unknown"
                    ),
                },
            }

    return {"status": "ok", "message": "Connection string format not recognized"}
