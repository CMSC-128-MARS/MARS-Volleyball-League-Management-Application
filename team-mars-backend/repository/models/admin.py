from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import func, relationship
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base


class Admin(Base):
    __tablename__ = "admin"
    admin_id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    evaluated_skills = relationship("PlayerSkill", back_populates="evaluator")
