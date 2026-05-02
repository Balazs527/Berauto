from app.blueprints.admin.schemas import LogSchema
from app.blueprints.car.schemas import CarSchema
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
        return True, CarSchema().dump(obj=cars, many=True)

    @staticmethod
    def create_car(uid, request):
        try:
            if db.session.execute(select(Car).filter_by(license_plate=request["license_plate"])).scalar_one_or_none():
                return False, "License plate already exists"
            car = Car(**request)
            db.session.add(car)
            db.session.flush()
            AdminService.log(uid, "car_create", "Car", car.id)
            db.session.commit()
            return True, CarSchema().dump(car)
        except Exception:
            db.session.rollback()
            return False, "Incorrect car data"

    @staticmethod
    def update_car(uid, cid, request):
        try:
            car = db.session.get(Car, cid)
            if car is None:
                return False, "Car not found"
            for key, value in request.items():
                setattr(car, key, value)
            AdminService.log(uid, "car_update", "Car", car.id)
            db.session.commit()
            return True, CarSchema().dump(car)
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
            return True, CarSchema().dump(car)
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
            return True, CarSchema().dump(car)
        except Exception:
            db.session.rollback()
            return False, "Odometer update failed"

    @staticmethod
    def set_availability(uid, cid, request):
        try:
            car = db.session.get(Car, cid)
            if car is None:
                return False, "Car not found"
            car.available = request["available"]
            AdminService.log(uid, "availability_update", "Car", car.id)
            db.session.commit()
            return True, CarSchema().dump(car)
        except Exception:
            db.session.rollback()
            return False, "Availability update failed"

    @staticmethod
    def list_logs():
        logs = db.session.execute(select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(200)).scalars().all()
        return True, LogSchema().dump(obj=logs, many=True)
