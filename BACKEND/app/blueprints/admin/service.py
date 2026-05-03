from app.extensions import db
from app.models.activitylog import ActivityLog
from app.models.car import Car
from sqlalchemy import select

class AdminService:

    @staticmethod
    def log(user_id, action, entity, entity_id):
        db.session.add(ActivityLog(user_id=user_id, action=action, entity=entity, entity_id=entity_id))

    @staticmethod
    def list_cars():
        cars = db.session.execute(select(Car).order_by(Car.id)).scalars().all()
        return True, cars

    @staticmethod
    def create_car(uid, request):
        try:
            if db.session.execute(select(Car).filter_by(license_plate=request["license_plate"])).scalar_one_or_none():
                return False, "License plate already exists"
            if request["daily_price"] <= 0:
                return False, "Daily price must be positive"
            if request["odometer"] < 0:
                return False, "Invalid odometer value"
            if request.get("active") is False and request.get("available") is True:
                return False, "Inactive car cannot be available"
            car = Car(**request)
            db.session.add(car)
            db.session.flush()
            AdminService.log(uid, "car_create", "Car", car.id)
            db.session.commit()
            return True, car
        except Exception:
            db.session.rollback()
            return False, "Incorrect car data"

    @staticmethod
    def update_car(uid, cid, request):
        try:
            car = db.session.get(Car, cid)
            if car is None:
                return False, "Car not found"
            if "license_plate" in request:
                existing = db.session.execute(select(Car).filter_by(license_plate=request["license_plate"])).scalar_one_or_none()
                if existing is not None and existing.id != car.id:
                    return False, "License plate already exists"
            if "daily_price" in request and request["daily_price"] <= 0:
                return False, "Daily price must be positive"
            if "odometer" in request and request["odometer"] < car.odometer:
                return False, "Invalid odometer value"
            future_active = request.get("active", car.active)
            future_available = request.get("available", car.available)
            if future_active is False and future_available is True:
                return False, "Inactive car cannot be available"
            for key, value in request.items():
                setattr(car, key, value)
            if not car.active:
                car.available = False
            AdminService.log(uid, "car_update", "Car", car.id)
            db.session.commit()
            return True, car
        except Exception:
            db.session.rollback()
            return False, "Car update failed"

    @staticmethod
    def delete_car(uid, cid):
        try:
            car = db.session.get(Car, cid)
            if car is None:
                return False, "Car not found"
            car.active = False
            car.available = False
            AdminService.log(uid, "car_delete", "Car", car.id)
            db.session.commit()
            return True, car
        except Exception:
            db.session.rollback()
            return False, "Car delete failed"

    @staticmethod
    def update_odometer(uid, cid, request):
        try:
            car = db.session.get(Car, cid)
            if car is None:
                return False, "Car not found"
            if request["odometer"] < car.odometer:
                return False, "Invalid odometer value"
            car.odometer = request["odometer"]
            AdminService.log(uid, "odometer_update", "Car", car.id)
            db.session.commit()
            return True, car
        except Exception:
            db.session.rollback()
            return False, "Odometer update failed"

    @staticmethod
    def set_availability(uid, cid, request):
        try:
            car = db.session.get(Car, cid)
            if car is None:
                return False, "Car not found"
            if not car.active and request["available"]:
                return False, "Inactive car cannot be available"
            car.available = request["available"]
            AdminService.log(uid, "availability_update", "Car", car.id)
            db.session.commit()
            return True, car
        except Exception:
            db.session.rollback()
            return False, "Availability update failed"

    @staticmethod
    def list_logs():
        logs = db.session.execute(select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(200)).scalars().all()
        return True, logs
