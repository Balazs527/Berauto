from app.extensions import db
from datetime import date, datetime
from sqlalchemy import Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Float, String
from typing import Optional

class Rental(db.Model):
    __tablename__ = "rentals"
    id: Mapped[int] = mapped_column(primary_key=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("cars.id"))
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))
    customer_id: Mapped[Optional[int]] = mapped_column(ForeignKey("customers.id"))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(30), default="requested")
    request_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    accepted_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    handover_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    returned_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    start_odometer: Mapped[Optional[int]]
    end_odometer: Mapped[Optional[int]]
    total_price: Mapped[float] = mapped_column(Float, default=0)
    clerk_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))
    return_clerk_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))

    car: Mapped["Car"] = relationship(back_populates="rentals")
    user: Mapped[Optional["User"]] = relationship(back_populates="rentals", foreign_keys=[user_id])
    customer: Mapped[Optional["Customer"]] = relationship(back_populates="rentals")
    clerk: Mapped[Optional["User"]] = relationship(back_populates="handled_rentals", foreign_keys=[clerk_id])
    return_clerk: Mapped[Optional["User"]] = relationship(back_populates="returned_rentals", foreign_keys=[return_clerk_id])
    invoice: Mapped[Optional["Invoice"]] = relationship(back_populates="rental", uselist=False)
