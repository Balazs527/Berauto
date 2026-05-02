from app.extensions import db
from app.models.tables import UserRole
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String
from typing import List, Optional
from werkzeug.security import check_password_hash, generate_password_hash

class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    email: Mapped[str] = mapped_column(String(120), unique=True)
    password: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(30))
    address_id: Mapped[Optional[int]] = mapped_column(ForeignKey("addresses.id"))

    address: Mapped[Optional["Address"]] = relationship(back_populates="users")
    roles: Mapped[List["Role"]] = relationship(secondary=UserRole, back_populates="users")
    rentals: Mapped[List["Rental"]] = relationship(back_populates="user", foreign_keys="Rental.user_id")
    handled_rentals: Mapped[List["Rental"]] = relationship(back_populates="clerk", foreign_keys="Rental.clerk_id")
    returned_rentals: Mapped[List["Rental"]] = relationship(back_populates="return_clerk", foreign_keys="Rental.return_clerk_id")
    logs: Mapped[List["ActivityLog"]] = relationship(back_populates="user")

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
