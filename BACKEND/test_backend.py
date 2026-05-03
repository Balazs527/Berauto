from config import Config
from app import create_app
from app.extensions import db
from app.models.address import Address
from app.models.car import Car
from app.models.role import Role
from app.models.user import User
from app.models.rental import Rental
from app.models.invoice import Invoice
from app.models.activitylog import ActivityLog
from datetime import date, timedelta
from sqlalchemy import text

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


def seed_data():
    role_user = Role(name="User")
    role_clerk = Role(name="Clerk")
    role_admin = Role(name="Admin")

    user = User(name="Teszt User", email="user@test.hu", phone="+36200000001", address=Address(city="Veszprém", street="User utca 1.", postalcode=8200))
    user.set_password("password123")
    user.roles.append(role_user)

    clerk = User(name="Teszt Clerk", email="clerk@test.hu", phone="+36200000002", address=Address(city="Veszprém", street="Clerk utca 1.", postalcode=8200))
    clerk.set_password("password123")
    clerk.roles.append(role_clerk)

    admin = User(name="Teszt Admin", email="admin@test.hu", phone="+36200000003", address=Address(city="Veszprém", street="Admin utca 1.", postalcode=8200))
    admin.set_password("password123")
    admin.roles.append(role_admin)

    car = Car(license_plate="AAA-111", brand="Toyota", model="Corolla", category="Kompakt", year=2021, daily_price=10000, odometer=1000, available=True, active=True, description="Teszt autó")
    db.session.add_all([role_user, role_clerk, role_admin, user, clerk, admin, car])
    db.session.commit()


def login(client, email):
    response = client.post("/api/user/login", json={"email": email, "password": "password123"})
    assert response.status_code == 200, response.get_data(as_text=True)
    token = response.json["token"]
    return {"Authorization": f"Bearer {token}"}


def test_full_backend_flow():
    app = create_app(config_class=TestConfig)
    with app.app_context():
        db.create_all()
        seed_data()
        assert db.session.execute(text("PRAGMA foreign_keys")).scalar() == 1
        assert db.session.execute(text("PRAGMA foreign_key_check")).all() == []

        client = app.test_client()
        user_header = login(client, "user@test.hu")
        clerk_header = login(client, "clerk@test.hu")
        admin_header = login(client, "admin@test.hu")

        available = client.get("/api/car/available")
        assert available.status_code == 200
        assert len(available.json) == 1

        start = date.today() + timedelta(days=10)
        end = start + timedelta(days=2)
        rental_response = client.post("/api/user/rentals/request", headers=user_header, json={"car_id": 1, "start_date": start.isoformat(), "end_date": end.isoformat()})
        assert rental_response.status_code == 200, rental_response.get_data(as_text=True)
        rental_id = rental_response.json["id"]
        assert rental_response.json["start_date"] == start.isoformat()
        assert rental_response.json["end_date"] == end.isoformat()

        overlap_response = client.post("/api/user/rentals/request", headers=user_header, json={"car_id": 1, "start_date": (start + timedelta(days=1)).isoformat(), "end_date": (end + timedelta(days=1)).isoformat()})
        assert overlap_response.status_code == 400

        past_response = client.post("/api/user/rentals/request", headers=user_header, json={"car_id": 1, "start_date": (date.today() - timedelta(days=1)).isoformat(), "end_date": date.today().isoformat()})
        assert past_response.status_code == 400

        accept_response = client.post(f"/api/clerk/rentals/{rental_id}/accept", headers=clerk_header)
        assert accept_response.status_code == 200
        assert accept_response.json["status"] == "accepted"

        handover_bad = client.post(f"/api/clerk/rentals/{rental_id}/handover", headers=clerk_header, json={"start_odometer": 999})
        assert handover_bad.status_code == 400

        handover_response = client.post(f"/api/clerk/rentals/{rental_id}/handover", headers=clerk_header, json={"start_odometer": 1100})
        assert handover_response.status_code == 200
        assert handover_response.json["status"] == "handed_over"

        return_bad = client.post(f"/api/clerk/rentals/{rental_id}/return", headers=clerk_header, json={"end_odometer": 1099})
        assert return_bad.status_code == 400

        return_response = client.post(f"/api/clerk/rentals/{rental_id}/return", headers=clerk_header, json={"end_odometer": 1200})
        assert return_response.status_code == 200
        assert return_response.json["status"] == "returned"

        invoice_response = client.post(f"/api/clerk/rentals/{rental_id}/invoice", headers=clerk_header)
        assert invoice_response.status_code == 200
        assert invoice_response.json["rental_id"] == rental_id

        invoice_duplicate = client.post(f"/api/clerk/rentals/{rental_id}/invoice", headers=clerk_header)
        assert invoice_duplicate.status_code == 400

        car_create = client.post("/api/admin/cars", headers=admin_header, json={"license_plate": "BBB-222", "brand": "Skoda", "model": "Octavia", "category": "Kombi", "year": 2022, "daily_price": 15000, "odometer": 5000, "available": True, "active": True, "description": "Teszt"})
        assert car_create.status_code == 200, car_create.get_data(as_text=True)
        car_id = car_create.json["id"]

        duplicate_plate = client.post("/api/admin/cars", headers=admin_header, json={"license_plate": "BBB-222", "brand": "Skoda", "model": "Octavia", "category": "Kombi", "year": 2022, "daily_price": 15000, "odometer": 5000, "available": True, "active": True, "description": "Teszt"})
        assert duplicate_plate.status_code == 400

        zero_price = client.post("/api/admin/cars", headers=admin_header, json={"license_plate": "CCC-333", "brand": "Ford", "model": "Focus", "category": "Kompakt", "year": 2020, "daily_price": 0, "odometer": 100, "available": True, "active": True, "description": "Teszt"})
        assert zero_price.status_code == 422

        odometer_down = client.patch(f"/api/admin/cars/{car_id}/odometer", headers=admin_header, json={"odometer": 4999})
        assert odometer_down.status_code == 400

        inactive_response = client.delete(f"/api/admin/cars/{car_id}", headers=admin_header)
        assert inactive_response.status_code == 200
        assert inactive_response.json["active"] is False
        assert inactive_response.json["available"] is False

        inactive_available = client.patch(f"/api/admin/cars/{car_id}/availability", headers=admin_header, json={"available": True})
        assert inactive_available.status_code == 400

        logs = client.get("/api/admin/logs", headers=admin_header)
        assert logs.status_code == 200
        assert len(logs.json) >= 1

        assert Rental.query.count() == 1
        assert Invoice.query.count() == 1
        assert ActivityLog.query.count() >= 1
        assert db.session.execute(text("PRAGMA foreign_key_check")).all() == []


if __name__ == "__main__":
    test_full_backend_flow()
    print("All backend tests passed")
