from app.extensions import db
from datetime import date, datetime
from sqlalchemy import CheckConstraint, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Float, String
from typing import Optional

class Rental(db.Model):
    __tablename__ = "rentals"
    __table_args__ = (
        CheckConstraint("end_date >= start_date", name="ck_rentals_date_range"),
        CheckConstraint("total_price >= 0", name="ck_rentals_total_price_nonnegative"),
        CheckConstraint("start_odometer IS NULL OR start_odometer >= 0", name="ck_rentals_start_odometer_nonnegative"),
        CheckConstraint("end_odometer IS NULL OR end_odometer >= 0", name="ck_rentals_end_odometer_nonnegative"),
        CheckConstraint("end_odometer IS NULL OR start_odometer IS NULL OR end_odometer >= start_odometer", name="ck_rentals_odometer_order"),
        CheckConstraint("user_id IS NOT NULL OR customer_id IS NOT NULL", name="ck_rentals_has_customer_or_user"),
        Index("ix_rentals_car_status_dates", "car_id", "status", "start_date", "end_date"),
        Index("ix_rentals_user_request_time", "user_id", "request_time"),
        Index("ix_rentals_status_end_date", "status", "end_date"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("cars.id"), index=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), index=True)
    customer_id: Mapped[Optional[int]] = mapped_column(ForeignKey("customers.id"), index=True)
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(30), default="requested", index=True)
    request_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    accepted_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    handover_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    returned_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    start_odometer: Mapped[Optional[int]]
    end_odometer: Mapped[Optional[int]]
    total_price: Mapped[float] = mapped_column(Float, default=0)
    clerk_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), index=True)
    return_clerk_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), index=True)

    car: Mapped["Car"] = relationship(back_populates="rentals")
    user: Mapped[Optional["User"]] = relationship(back_populates="rentals", foreign_keys=[user_id])
    customer: Mapped[Optional["Customer"]] = relationship(back_populates="rentals")
    clerk: Mapped[Optional["User"]] = relationship(back_populates="handled_rentals", foreign_keys=[clerk_id])
    return_clerk: Mapped[Optional["User"]] = relationship(back_populates="returned_rentals", foreign_keys=[return_clerk_id])
    invoice: Mapped[Optional["Invoice"]] = relationship(back_populates="rental", uselist=False)
