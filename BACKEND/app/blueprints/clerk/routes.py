from apiflask import HTTPError
from app.blueprints import role_required
from app.blueprints.clerk import bp
from app.blueprints.clerk.service import ClerkService
from app.blueprints.rental.schemas import HandoverSchema, InvoiceSchema, RentalResponseSchema, ReturnSchema
from app.extensions import auth

@bp.get("/rentals/requests")
@bp.auth_required(auth)
@role_required(["Clerk", "Admin"])
@bp.output(RentalResponseSchema(many=True))
def clerk_rental_requests():
    success, response = ClerkService.list_requests()
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.get("/rentals/running")
@bp.auth_required(auth)
@role_required(["Clerk", "Admin"])
@bp.output(RentalResponseSchema(many=True))
def clerk_rental_running():
    success, response = ClerkService.list_running()
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.get("/rentals/expired")
@bp.auth_required(auth)
@role_required(["Clerk", "Admin"])
@bp.output(RentalResponseSchema(many=True))
def clerk_rental_expired():
    success, response = ClerkService.list_expired()
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.post("/rentals/<int:rid>/accept")
@bp.auth_required(auth)
@role_required(["Clerk", "Admin"])
@bp.output(RentalResponseSchema)
def clerk_accept(rid):
    success, response = ClerkService.accept(auth.current_user.get("user_id"), rid)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.post("/rentals/<int:rid>/handover")
@bp.auth_required(auth)
@role_required(["Clerk", "Admin"])
@bp.input(HandoverSchema, location="json")
@bp.output(RentalResponseSchema)
def clerk_handover(rid, json_data):
    success, response = ClerkService.handover(auth.current_user.get("user_id"), rid, json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.post("/rentals/<int:rid>/return")
@bp.auth_required(auth)
@role_required(["Clerk", "Admin"])
@bp.input(ReturnSchema, location="json")
@bp.output(RentalResponseSchema)
def clerk_return(rid, json_data):
    success, response = ClerkService.return_car(auth.current_user.get("user_id"), rid, json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.post("/rentals/<int:rid>/invoice")
@bp.auth_required(auth)
@role_required(["Clerk", "Admin"])
@bp.output(InvoiceSchema)
def clerk_invoice(rid):
    success, response = ClerkService.create_invoice(auth.current_user.get("user_id"), rid)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)
