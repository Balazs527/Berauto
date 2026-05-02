PRAGMA foreign_keys=ON;
CREATE TABLE addresses (
    id INTEGER NOT NULL PRIMARY KEY,
    city VARCHAR(80) NOT NULL,
    street VARCHAR(120) NOT NULL,
    postalcode INTEGER NOT NULL
);
CREATE TABLE roles (
    id INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE
);
CREATE TABLE users (
    id INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address_id INTEGER,
    FOREIGN KEY(address_id) REFERENCES addresses(id)
);
CREATE TABLE userroles (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(role_id) REFERENCES roles(id)
);
CREATE TABLE customers (
    id INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(120),
    phone VARCHAR(30) NOT NULL,
    address_id INTEGER,
    FOREIGN KEY(address_id) REFERENCES addresses(id)
);
CREATE TABLE cars (
    id INTEGER NOT NULL PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    daily_price FLOAT NOT NULL,
    odometer INTEGER NOT NULL,
    available BOOLEAN NOT NULL,
    active BOOLEAN NOT NULL,
    description VARCHAR(255)
);
CREATE TABLE rentals (
    id INTEGER NOT NULL PRIMARY KEY,
    car_id INTEGER NOT NULL,
    user_id INTEGER,
    customer_id INTEGER,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL,
    request_time DATETIME NOT NULL,
    accepted_at DATETIME,
    handover_at DATETIME,
    returned_at DATETIME,
    start_odometer INTEGER,
    end_odometer INTEGER,
    total_price FLOAT NOT NULL,
    clerk_id INTEGER,
    return_clerk_id INTEGER,
    FOREIGN KEY(car_id) REFERENCES cars(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(customer_id) REFERENCES customers(id),
    FOREIGN KEY(clerk_id) REFERENCES users(id),
    FOREIGN KEY(return_clerk_id) REFERENCES users(id)
);
CREATE TABLE invoices (
    id INTEGER NOT NULL PRIMARY KEY,
    rental_id INTEGER NOT NULL UNIQUE,
    invoice_number VARCHAR(40) NOT NULL UNIQUE,
    issue_date DATETIME NOT NULL,
    net_amount FLOAT NOT NULL,
    tax_amount FLOAT NOT NULL,
    gross_amount FLOAT NOT NULL,
    paid BOOLEAN NOT NULL,
    FOREIGN KEY(rental_id) REFERENCES rentals(id)
);
CREATE TABLE activity_logs (
    id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(80) NOT NULL,
    entity VARCHAR(80) NOT NULL,
    entity_id INTEGER,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
