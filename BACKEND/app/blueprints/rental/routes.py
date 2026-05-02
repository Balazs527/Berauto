from apiflask import HTTPError
from app.blueprints.rental import bp
from app.blueprints.rental.schemas import PublicRentalRequestSchema, RentalResponseSchema
from app.blueprints.rental.service import RentalService

@bp.post("/request")
@bp.input(PublicRentalRequestSchema, location="json")
@bp.output(RentalResponseSchema)
def rental_public_request(json_data):
    success, response = RentalService.public_request(json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)
