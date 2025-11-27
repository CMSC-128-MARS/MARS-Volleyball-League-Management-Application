from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.config import get_db

router = APIRouter(prefix="/health", tags=["System"])

@router.get("/db")
def health_db(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "unreachable", "detail": str(e)}
