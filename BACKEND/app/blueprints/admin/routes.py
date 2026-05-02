from apiflask import HTTPError
from app.blueprints import role_required
from app.blueprints.admin import bp
from app.blueprints.admin.schemas import LogSchema
from app.blueprints.admin.service import AdminService
from app.blueprints.car.schemas import AvailabilitySchema, CarRequestSchema, CarSchema, CarUpdateSchema, OdometerSchema
from app.extensions import auth

@bp.get("/cars")
@bp.auth_required(auth)
@role_required(["Admin"])
@bp.output(CarSchema(many=True))
def admin_list_cars():
    success, response = AdminService.list_cars()
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.post("/cars")
@bp.auth_required(auth)
@role_required(["Admin"])
@bp.input(CarRequestSchema, location="json")
@bp.output(CarSchema)
def admin_create_car(json_data):
    success, response = AdminService.create_car(auth.current_user.get("user_id"), json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.put("/cars/<int:cid>")
@bp.auth_required(auth)
@role_required(["Admin"])
@bp.input(CarUpdateSchema, location="json")
@bp.output(CarSchema)
def admin_update_car(cid, json_data):
    success, response = AdminService.update_car(auth.current_user.get("user_id"), cid, json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.delete("/cars/<int:cid>")
@bp.auth_required(auth)
@role_required(["Admin"])
@bp.output(CarSchema)
def admin_delete_car(cid):
    success, response = AdminService.delete_car(auth.current_user.get("user_id"), cid)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.patch("/cars/<int:cid>/odometer")
@bp.auth_required(auth)
@role_required(["Admin"])
@bp.input(OdometerSchema, location="json")
@bp.output(CarSchema)
def admin_update_odometer(cid, json_data):
    success, response = AdminService.update_odometer(auth.current_user.get("user_id"), cid, json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.patch("/cars/<int:cid>/availability")
@bp.auth_required(auth)
@role_required(["Admin", "Clerk"])
@bp.input(AvailabilitySchema, location="json")
@bp.output(CarSchema)
def admin_set_availability(cid, json_data):
    success, response = AdminService.set_availability(auth.current_user.get("user_id"), cid, json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.get("/logs")
@bp.auth_required(auth)
@role_required(["Admin"])
@bp.output(LogSchema(many=True))
def admin_logs():
    success, response = AdminService.list_logs()
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)
