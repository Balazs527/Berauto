from app.extensions import db
from sqlalchemy import CheckConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Boolean, Float, String
from typing import List, Optional

class Car(db.Model):
    __tablename__ = "cars"
    __table_args__ = (
        CheckConstraint("daily_price > 0", name="ck_cars_daily_price_positive"),
        CheckConstraint("odometer >= 0", name="ck_cars_odometer_nonnegative"),
        CheckConstraint("year >= 1980", name="ck_cars_year_min"),
        CheckConstraint("active = 1 OR available = 0", name="ck_cars_inactive_not_available"),
        Index("ix_cars_active_available", "active", "available"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    license_plate: Mapped[str] = mapped_column(String(20), unique=True, index=True)
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
