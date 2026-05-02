from app.extensions import db
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Boolean, Float, String

class Invoice(db.Model):
    __tablename__ = "invoices"
    id: Mapped[int] = mapped_column(primary_key=True)
    rental_id: Mapped[int] = mapped_column(ForeignKey("rentals.id"), unique=True)
    invoice_number: Mapped[str] = mapped_column(String(40), unique=True)
    issue_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    net_amount: Mapped[float] = mapped_column(Float)
    tax_amount: Mapped[float] = mapped_column(Float)
    gross_amount: Mapped[float] = mapped_column(Float)
    paid: Mapped[bool] = mapped_column(Boolean, default=False)

    rental: Mapped["Rental"] = relationship(back_populates="invoice")
