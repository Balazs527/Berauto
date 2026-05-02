from apiflask import APIBlueprint, HTTPError
from app.extensions import auth
from authlib.jose import jwt
from datetime import datetime
from flask import current_app
from functools import wraps

bp = APIBlueprint("main", __name__, tag="default")

@bp.get("/")
def index():
    return {"message": "BérAutó API"}

@auth.verify_token
def verify_token(token):
    try:
        data = jwt.decode(token.encode("ascii"), current_app.config["SECRET_KEY"])
        if data["exp"] < int(datetime.now().timestamp()):
            return None
        return data
    except Exception:
        return None

def role_required(roles):
    def wrapper(fn):
        @wraps(fn)
        def decorated_function(*args, **kwargs):
            user_roles = [item["name"] for item in auth.current_user.get("roles", [])]
            for role in roles:
                if role in user_roles:
                    return fn(*args, **kwargs)
            raise HTTPError(message="Access denied", status_code=403)
        return decorated_function
    return wrapper

from app.blueprints.user import bp as bp_user
from app.blueprints.car import bp as bp_car
from app.blueprints.rental import bp as bp_rental
from app.blueprints.clerk import bp as bp_clerk
from app.blueprints.admin import bp as bp_admin

bp.register_blueprint(bp_user, url_prefix="/user")
bp.register_blueprint(bp_car, url_prefix="/car")
bp.register_blueprint(bp_rental, url_prefix="/rental")
bp.register_blueprint(bp_clerk, url_prefix="/clerk")
bp.register_blueprint(bp_admin, url_prefix="/admin")

from app.models import *
