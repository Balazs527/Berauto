from sqlalchemy import Column, ForeignKey, Table
from app.extensions import Base

UserRole = Table(
    "userroles",
    Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("role_id", ForeignKey("roles.id"), primary_key=True)
)
