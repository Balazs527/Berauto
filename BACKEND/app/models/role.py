from app.extensions import db
from app.models.tables import UserRole
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String
from typing import List

class Role(db.Model):
    __tablename__ = "roles"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30), unique=True)

    users: Mapped[List["User"]] = relationship(secondary=UserRole, back_populates="roles")
