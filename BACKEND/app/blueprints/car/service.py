from app.extensions import db
from app.models.car import Car
from sqlalchemy import select

class CarService:

    @staticmethod
    def list_available():
        cars = db.session.execute(select(Car).where(Car.active == True, Car.available == True).order_by(Car.brand, Car.model)).scalars().all()
        return True, cars

    @staticmethod
    def get_car(cid):
        car = db.session.get(Car, cid)
        if car is None or not car.active:
            return False, "Car not found"
        return True, car
