from app.extensions import db
from app.models.activitylog import ActivityLog
from app.models.invoice import Invoice
from app.models.rental import Rental
from datetime import date, datetime
from sqlalchemy import select
from app.models.car import Car

class ClerkService:

    @staticmethod
    def log(user_id, action, entity, entity_id):
        db.session.add(ActivityLog(user_id=user_id, action=action, entity=entity, entity_id=entity_id))

    @staticmethod
    def list_requests():
        records = db.session.execute(select(Rental).filter_by(status="requested").order_by(Rental.request_time)).scalars().all()
        return True, records

    @staticmethod
    def list_cars():
        cars = db.session.execute(select(Car).order_by(Car.id)).scalars().all()
        return True, cars

    @staticmethod
    def list_running():
        records = db.session.execute(select(Rental).where(Rental.status.in_(["accepted", "handed_over"])).order_by(Rental.start_date)).scalars().all()
        return True, records

    @staticmethod
    def list_expired():
        records = db.session.execute(select(Rental).where((Rental.status == "returned") | ((Rental.end_date < date.today()) & (Rental.status != "cancelled"))).order_by(Rental.end_date.desc())).scalars().all()
        return True, records

    @staticmethod
    def accept(uid, rid):
        try:
            rental = db.session.get(Rental, rid)
            if rental is None or rental.status != "requested":
                return False, "Rental request not found"
            rental.status = "accepted"
            rental.clerk_id = uid
            rental.accepted_at = datetime.utcnow()
            ClerkService.log(uid, "rental_accept", "Rental", rental.id)
            db.session.commit()
            return True, rental
        except Exception:
            db.session.rollback()
            return False, "Accept failed"

    @staticmethod
    def handover(uid, rid, request):
        try:
            rental = db.session.get(Rental, rid)
            if rental is None or rental.status != "accepted":
                return False, "Rental is not accepted"
            if request["start_odometer"] < rental.car.odometer:
                return False, "Invalid odometer value"
            rental.status = "handed_over"
            rental.handover_at = datetime.utcnow()
            rental.start_odometer = request["start_odometer"]
            rental.car.odometer = request["start_odometer"]
            rental.car.available = False
            ClerkService.log(uid, "car_handover", "Rental", rental.id)
            db.session.commit()
            return True, rental
        except Exception:
            db.session.rollback()
            return False, "Handover failed"

    @staticmethod
    def return_car(uid, rid, request):
        try:
            rental = db.session.get(Rental, rid)
            if rental is None or rental.status != "handed_over":
                return False, "Rental is not running"
            if request["end_odometer"] < rental.car.odometer:
                return False, "Invalid odometer value"
            rental.status = "returned"
            rental.returned_at = datetime.utcnow()
            rental.return_clerk_id = uid
            rental.end_odometer = request["end_odometer"]
            rental.car.odometer = request["end_odometer"]
            rental.car.available = rental.car.active
            ClerkService.log(uid, "car_return", "Rental", rental.id)
            db.session.commit()
            return True, rental
        except Exception:
            db.session.rollback()
            return False, "Return failed"

    @staticmethod
    def create_invoice(uid, rid):
        try:
            rental = db.session.get(Rental, rid)
            if rental is None or rental.status != "returned":
                return False, "Returned rental not found"
            if rental.invoice is not None:
                return False, "Invoice already exists"
            net = round(rental.total_price, 2)
            tax = round(net * 0.27, 2)
            gross = round(net + tax, 2)
            invoice = Invoice(rental_id=rental.id, invoice_number=f"BA-{datetime.utcnow().strftime('%Y%m%d')}-{rental.id:05d}", net_amount=net, tax_amount=tax, gross_amount=gross)
            db.session.add(invoice)
            db.session.flush()
            ClerkService.log(uid, "invoice_create", "Invoice", invoice.id)
            db.session.commit()
            return True, invoice
        except Exception:
            db.session.rollback()
            return False, "Invoice creation failed"
