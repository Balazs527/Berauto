from apiflask import HTTPError
from app.blueprints.car import bp
from app.blueprints.car.schemas import CarSchema
from app.blueprints.car.service import CarService

@bp.get("/available")
@bp.output(CarSchema(many=True))
def car_list_available():
    success, response = CarService.list_available()
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.get("/<int:cid>")
@bp.output(CarSchema)
def car_get(cid):
    success, response = CarService.get_car(cid)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=404)
