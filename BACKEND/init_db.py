from app import create_app
from app.extensions import db
from app.models.address import Address
from app.models.car import Car
from app.models.role import Role
from app.models.user import User

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    role_user = Role(name="User")
    role_clerk = Role(name="Clerk")
    role_admin = Role(name="Admin")

    admin_address = Address(city="Veszprém", street="Egyetem utca 10.", postalcode=8200)
    clerk_address = Address(city="Veszprém", street="Kossuth utca 1.", postalcode=8200)
    user_address = Address(city="Budapest", street="Fő utca 12.", postalcode=1011)

    admin = User(name="Admin", email="admin@berauto.hu", phone="+36201111111", address=admin_address)
    admin.set_password("admin123")
    admin.roles.append(role_admin)

    clerk = User(name="Ügyintéző", email="ugyintezo@berauto.hu", phone="+36202222222", address=clerk_address)
    clerk.set_password("ugyintezo123")
    clerk.roles.append(role_clerk)

    user = User(name="Teszt Elek", email="teszt@berauto.hu", phone="+36203333333", address=user_address)
    user.set_password("teszt123")
    user.roles.append(role_user)

    cars = [
        Car(license_plate="ABC-123", brand="Toyota", model="Corolla", category="Kompakt", year=2021, daily_price=14900, odometer=68420, available=True, active=True, description="Automata váltós benzines autó"),
        Car(license_plate="DEF-456", brand="Skoda", model="Octavia", category="Kombi", year=2020, daily_price=16900, odometer=92110, available=True, active=True, description="Tágas családi autó"),
        Car(license_plate="GHI-789", brand="Ford", model="Transit", category="Kisteherautó", year=2019, daily_price=22900, odometer=134500, available=True, active=True, description="Nagy rakterű kisteherautó")
    ]

    db.session.add_all([role_user, role_clerk, role_admin, admin, clerk, user] + cars)
    db.session.commit()
    print("Database initialized")
