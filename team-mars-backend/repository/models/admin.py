from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship, func
from sqlalchemy.dialects.postgresql import UUID
from repository.database import Base


class Admin(Base):
    __tablename__ = "admin"

    admin_id = Column(UUID(as_uuid=True), primary_key=True)
    cognito_sub = Column(
        String, unique=True, nullable=False, index=True
    )  # Cognito user sub
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    role = Column(String, nullable=False, default="admin")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    evaluated_skills = relationship("PlayerSkill", back_populates="evaluator")
