from apiflask import APIFlask
from flask_migrate import Migrate
from config import Config
from app.extensions import db


def create_app(config_class=Config):
    app = APIFlask(__name__, json_errors=True, title="BérAutó API", docs_path="/swagger")
    app.config.from_object(config_class)
    db.init_app(app)
    Migrate(app, db, render_as_batch=True)

    from app import models
    from app.blueprints import bp as bp_default
    app.register_blueprint(bp_default, url_prefix="/api")

    return app
