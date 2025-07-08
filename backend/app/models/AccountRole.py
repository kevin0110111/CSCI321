from sqlalchemy import Column, Integer, ForeignKey, Table
from ..database import Base

# This is the invisible association table
account_roles = Table(
    "account_roles",
    Base.metadata,
    Column("account_id", Integer, ForeignKey("accounts.account_id"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.role_id"), primary_key=True),
)