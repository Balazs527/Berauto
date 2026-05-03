from app.extensions import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String
from typing import List, Optional

class Customer(db.Model):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    email: Mapped[Optional[str]] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(30))
    address_id: Mapped[Optional[int]] = mapped_column(ForeignKey("addresses.id"), index=True)

    address: Mapped[Optional["Address"]] = relationship(back_populates="customers")
    rentals: Mapped[List["Rental"]] = relationship(back_populates="customer")
