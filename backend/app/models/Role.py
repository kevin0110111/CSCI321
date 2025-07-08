from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from .AccountRole import account_roles
from ..database import Base
import enum

class RoleStateEnum(enum.Enum):
    active = "active"
    suspended = "suspended"

class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    state = Column(Enum(RoleStateEnum), default=RoleStateEnum.active)

    # Relationship with accounts (many-to-many would be through an association table)
    account = relationship("Account", secondary=account_roles, back_populates="role")