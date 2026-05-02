from config import Config
from app import create_app
from app.extensions import db
from app.models.car import Car

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


def test_app_can_create_database():
    app = create_app(config_class=TestConfig)
    with app.app_context():
        db.create_all()
        db.session.add(Car(license_plate="TST-001", brand="Test", model="Car", category="Test", year=2024, daily_price=10000, odometer=10, available=True, active=True, description="Test"))
        db.session.commit()
        assert Car.query.count() == 1
