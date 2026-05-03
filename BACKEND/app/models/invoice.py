from app.extensions import db
from datetime import datetime
from sqlalchemy import CheckConstraint, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Boolean, Float, String

class Invoice(db.Model):
    __tablename__ = "invoices"
    __table_args__ = (
        CheckConstraint("net_amount >= 0", name="ck_invoices_net_amount_nonnegative"),
        CheckConstraint("tax_amount >= 0", name="ck_invoices_tax_amount_nonnegative"),
        CheckConstraint("gross_amount >= 0", name="ck_invoices_gross_amount_nonnegative"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    rental_id: Mapped[int] = mapped_column(ForeignKey("rentals.id"), unique=True, index=True)
    invoice_number: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    issue_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    net_amount: Mapped[float] = mapped_column(Float)
    tax_amount: Mapped[float] = mapped_column(Float)
    gross_amount: Mapped[float] = mapped_column(Float)
    paid: Mapped[bool] = mapped_column(Boolean, default=False)

    rental: Mapped["Rental"] = relationship(back_populates="invoice")
