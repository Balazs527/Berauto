from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Boolean, Float, String
from typing import List, Optional

class Car(db.Model):
    __tablename__ = "cars"
    id: Mapped[int] = mapped_column(primary_key=True)
    license_plate: Mapped[str] = mapped_column(String(20), unique=True)
    brand: Mapped[str] = mapped_column(String(50))
    model: Mapped[str] = mapped_column(String(50))
    category: Mapped[str] = mapped_column(String(50))
    year: Mapped[int]
    daily_price: Mapped[float] = mapped_column(Float)
    odometer: Mapped[int]
    available: Mapped[bool] = mapped_column(Boolean, default=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    description: Mapped[Optional[str]] = mapped_column(String(255))

    rentals: Mapped[List["Rental"]] = relationship(back_populates="car")
