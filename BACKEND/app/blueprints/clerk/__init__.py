from apiflask import APIBlueprint

bp = APIBlueprint("clerk", __name__, tag="clerk")

from app.blueprints.clerk import routes
