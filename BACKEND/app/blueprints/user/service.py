from app.extensions import db
from app.blueprints.user.schemas import RoleSchema
from app.models.address import Address
from app.models.car import Car
from app.models.rental import Rental
from app.models.role import Role
from app.models.user import User
from app.models.activitylog import ActivityLog
from authlib.jose import jwt
from datetime import date, datetime, timedelta
from flask import current_app
from sqlalchemy import select

class UserService:

    @staticmethod
    def log(user_id, action, entity, entity_id):
        db.session.add(ActivityLog(user_id=user_id, action=action, entity=entity, entity_id=entity_id))

    @staticmethod
    def token_generate(user):
        payload = {
            "user_id": user.id,
            "roles": RoleSchema().dump(obj=user.roles, many=True),
            "exp": int((datetime.now() + timedelta(minutes=60)).timestamp())
        }
        token = jwt.encode({"alg": "HS256"}, payload, current_app.config["SECRET_KEY"])
        if isinstance(token, bytes):
            return token.decode()
        return token

    @staticmethod
    def user_registrate(request):
        try:
            if db.session.execute(select(User).filter_by(email=request["email"])).scalar_one_or_none():
                return False, "E-mail already exists"
            request["address"] = Address(**request["address"])
            user = User(**request)
            user.set_password(user.password)
            user.roles.append(db.session.execute(select(Role).filter_by(name="User")).scalar_one())
            db.session.add(user)
            db.session.flush()
            UserService.log(user.id, "registrate", "User", user.id)
            db.session.commit()
            user.token = UserService.token_generate(user)
            return True, user
        except Exception:
            db.session.rollback()
            return False, "Incorrect user data"

    @staticmethod
    def user_login(request):
        try:
            user = db.session.execute(select(User).filter_by(email=request["email"])).scalar_one()
            if not user.check_password(request["password"]):
                return False, "Incorrect e-mail or password"
            user.token = UserService.token_generate(user)
            return True, user
        except Exception:
            return False, "Incorrect login data"

    @staticmethod
    def get_profile(uid):
        user = db.session.get(User, uid)
        if user is None:
            return False, "User not found"
        return True, user

    @staticmethod
    def update_profile(uid, request):
        try:
            user = db.session.get(User, uid)
            if user is None:
                return False, "User not found"
            if "phone" in request:
                user.phone = request["phone"]
            if "address" in request:
                if user.address is None:
                    user.address = Address(**request["address"])
                else:
                    user.address.city = request["address"]["city"]
                    user.address.street = request["address"]["street"]
                    user.address.postalcode = request["address"]["postalcode"]
            UserService.log(uid, "profile_update", "User", uid)
            db.session.commit()
            user.token = UserService.token_generate(user)
            return True, user
        except Exception:
            db.session.rollback()
            return False, "Incorrect profile data"

    @staticmethod
    def rental_history(uid):
        records = db.session.execute(select(Rental).filter_by(user_id=uid).order_by(Rental.request_time.desc())).scalars().all()
        return True, records

    @staticmethod
    def request_rental(uid, request):
        try:
            car = db.session.get(Car, request["car_id"])
            if car is None or not car.active or not car.available:
                return False, "Car is not available"
            if request["start_date"] < date.today():
                return False, "Rental cannot start in the past"
            if request["end_date"] < request["start_date"]:
                return False, "Invalid rental period"
            if UserService.has_overlap(car.id, request["start_date"], request["end_date"]):
                return False, "Car is reserved in this period"
            days = (request["end_date"] - request["start_date"]).days + 1
            rental = Rental(car_id=car.id, user_id=uid, start_date=request["start_date"], end_date=request["end_date"], total_price=days * car.daily_price)
            db.session.add(rental)
            db.session.flush()
            UserService.log(uid, "rental_request", "Rental", rental.id)
            db.session.commit()
            return True, rental
        except Exception:
            db.session.rollback()
            return False, "Incorrect rental data"

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
