from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String
from typing import List

class Address(db.Model):
    __tablename__ = "addresses"
    id: Mapped[int] = mapped_column(primary_key=True)
    city: Mapped[str] = mapped_column(String(80))
    street: Mapped[str] = mapped_column(String(120))
    postalcode: Mapped[int]

    users: Mapped[List["User"]] = relationship(back_populates="address")
    customers: Mapped[List["Customer"]] = relationship(back_populates="address")
