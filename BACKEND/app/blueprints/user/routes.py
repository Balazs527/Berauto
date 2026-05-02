from apiflask import HTTPError
from app.blueprints.user import bp
from app.blueprints.user.schemas import UserLoginSchema, UserRequestSchema, UserResponseSchema, UserUpdateSchema
from app.blueprints.rental.schemas import RentalRequestSchema, RentalResponseSchema
from app.blueprints.user.service import UserService
from app.blueprints import role_required
from app.extensions import auth

@bp.post("/registrate")
@bp.input(UserRequestSchema, location="json")
@bp.output(UserResponseSchema)
def user_registrate(json_data):
    success, response = UserService.user_registrate(json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.post("/login")
@bp.input(UserLoginSchema, location="json")
@bp.output(UserResponseSchema)
def user_login(json_data):
    success, response = UserService.user_login(json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.get("/profile")
@bp.auth_required(auth)
@role_required(["User", "Clerk", "Admin"])
@bp.output(UserResponseSchema)
def user_profile():
    success, response = UserService.get_profile(auth.current_user.get("user_id"))
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=404)

@bp.put("/profile")
@bp.auth_required(auth)
@role_required(["User", "Clerk", "Admin"])
@bp.input(UserUpdateSchema, location="json")
@bp.output(UserResponseSchema)
def user_profile_update(json_data):
    success, response = UserService.update_profile(auth.current_user.get("user_id"), json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.get("/rentals")
@bp.auth_required(auth)
@role_required(["User"])
@bp.output(RentalResponseSchema(many=True))
def user_rental_history():
    success, response = UserService.rental_history(auth.current_user.get("user_id"))
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.post("/rentals/request")
@bp.auth_required(auth)
@role_required(["User"])
@bp.input(RentalRequestSchema, location="json")
@bp.output(RentalResponseSchema)
def user_rental_request(json_data):
    success, response = UserService.request_rental(auth.current_user.get("user_id"), json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)
