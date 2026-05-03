from app.extensions import db
from app.models.address import Address
from app.models.car import Car
from app.models.customer import Customer
from app.models.rental import Rental
from app.models.activitylog import ActivityLog
from datetime import date
from sqlalchemy import select

class RentalService:

    @staticmethod
    def has_overlap(car_id, start_date, end_date):
        statuses = ["requested", "accepted", "handed_over"]
        return db.session.execute(
            select(Rental).where(
                Rental.car_id == car_id,
                Rental.status.in_(statuses),
                Rental.start_date <= end_date,
                Rental.end_date >= start_date
            )
        ).scalar_one_or_none() is not None

    @staticmethod
    def public_request(request):
        try:
            car = db.session.get(Car, request["car_id"])
            if car is None or not car.active or not car.available:
                return False, "Car is not available"
            if request["start_date"] < date.today():
                return False, "Rental cannot start in the past"
            if request["end_date"] < request["start_date"]:
                return False, "Invalid rental period"
            if RentalService.has_overlap(car.id, request["start_date"], request["end_date"]):
                return False, "Car is reserved in this period"
            customer_data = request["customer"]
            customer_data["address"] = Address(**customer_data["address"])
            customer = Customer(**customer_data)
            days = (request["end_date"] - request["start_date"]).days + 1
            rental = Rental(car_id=car.id, customer=customer, start_date=request["start_date"], end_date=request["end_date"], total_price=days * car.daily_price)
            db.session.add(rental)
            db.session.flush()
            db.session.add(ActivityLog(user_id=None, action="public_rental_request", entity="Rental", entity_id=rental.id))
            db.session.commit()
            return True, rental
        except Exception:
            db.session.rollback()
            return False, "Incorrect rental data"
