PRAGMA foreign_keys=ON;
CREATE TABLE addresses (
	id INTEGER NOT NULL, 
	city VARCHAR(80) NOT NULL, 
	street VARCHAR(120) NOT NULL, 
	postalcode INTEGER NOT NULL, 
	PRIMARY KEY (id)
);
CREATE TABLE roles (
	id INTEGER NOT NULL, 
	name VARCHAR(30) NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (name)
);
CREATE TABLE users (
	id INTEGER NOT NULL, 
	name VARCHAR(80) NOT NULL, 
	email VARCHAR(120) NOT NULL, 
	password VARCHAR(255) NOT NULL, 
	phone VARCHAR(30) NOT NULL, 
	address_id INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(address_id) REFERENCES addresses (id)
);
CREATE TABLE userroles (
	user_id INTEGER NOT NULL, 
	role_id INTEGER NOT NULL, 
	PRIMARY KEY (user_id, role_id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(role_id) REFERENCES roles (id)
);
CREATE TABLE customers (
	id INTEGER NOT NULL, 
	name VARCHAR(80) NOT NULL, 
	email VARCHAR(120), 
	phone VARCHAR(30) NOT NULL, 
	address_id INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(address_id) REFERENCES addresses (id)
);
CREATE TABLE cars (
	id INTEGER NOT NULL, 
	license_plate VARCHAR(20) NOT NULL, 
	brand VARCHAR(50) NOT NULL, 
	model VARCHAR(50) NOT NULL, 
	category VARCHAR(50) NOT NULL, 
	year INTEGER NOT NULL, 
	daily_price FLOAT NOT NULL, 
	odometer INTEGER NOT NULL, 
	available BOOLEAN NOT NULL, 
	active BOOLEAN NOT NULL, 
	description VARCHAR(255), 
	PRIMARY KEY (id), 
	CONSTRAINT ck_cars_daily_price_positive CHECK (daily_price > 0), 
	CONSTRAINT ck_cars_odometer_nonnegative CHECK (odometer >= 0), 
	CONSTRAINT ck_cars_year_min CHECK (year >= 1980), 
	CONSTRAINT ck_cars_inactive_not_available CHECK (active = 1 OR available = 0)
);
CREATE TABLE rentals (
	id INTEGER NOT NULL, 
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
	PRIMARY KEY (id), 
	CONSTRAINT ck_rentals_date_range CHECK (end_date >= start_date), 
	CONSTRAINT ck_rentals_total_price_nonnegative CHECK (total_price >= 0), 
	CONSTRAINT ck_rentals_start_odometer_nonnegative CHECK (start_odometer IS NULL OR start_odometer >= 0), 
	CONSTRAINT ck_rentals_end_odometer_nonnegative CHECK (end_odometer IS NULL OR end_odometer >= 0), 
	CONSTRAINT ck_rentals_odometer_order CHECK (end_odometer IS NULL OR start_odometer IS NULL OR end_odometer >= start_odometer), 
	CONSTRAINT ck_rentals_has_customer_or_user CHECK (user_id IS NOT NULL OR customer_id IS NOT NULL), 
	FOREIGN KEY(car_id) REFERENCES cars (id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(customer_id) REFERENCES customers (id), 
	FOREIGN KEY(clerk_id) REFERENCES users (id), 
	FOREIGN KEY(return_clerk_id) REFERENCES users (id)
);
CREATE TABLE invoices (
	id INTEGER NOT NULL, 
	rental_id INTEGER NOT NULL, 
	invoice_number VARCHAR(40) NOT NULL, 
	issue_date DATETIME NOT NULL, 
	net_amount FLOAT NOT NULL, 
	tax_amount FLOAT NOT NULL, 
	gross_amount FLOAT NOT NULL, 
	paid BOOLEAN NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT ck_invoices_net_amount_nonnegative CHECK (net_amount >= 0), 
	CONSTRAINT ck_invoices_tax_amount_nonnegative CHECK (tax_amount >= 0), 
	CONSTRAINT ck_invoices_gross_amount_nonnegative CHECK (gross_amount >= 0), 
	FOREIGN KEY(rental_id) REFERENCES rentals (id)
);
CREATE TABLE activity_logs (
	id INTEGER NOT NULL, 
	user_id INTEGER, 
	action VARCHAR(80) NOT NULL, 
	entity VARCHAR(80) NOT NULL, 
	entity_id INTEGER, 
	created_at DATETIME NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);
CREATE INDEX ix_activity_logs_created_at ON activity_logs (created_at);
CREATE INDEX ix_activity_logs_user_created_at ON activity_logs (user_id, created_at);
CREATE INDEX ix_activity_logs_user_id ON activity_logs (user_id);
CREATE INDEX ix_cars_active_available ON cars (active, available);
CREATE UNIQUE INDEX ix_cars_license_plate ON cars (license_plate);
CREATE INDEX ix_customers_address_id ON customers (address_id);
CREATE UNIQUE INDEX ix_invoices_invoice_number ON invoices (invoice_number);
CREATE UNIQUE INDEX ix_invoices_rental_id ON invoices (rental_id);
CREATE INDEX ix_rentals_car_id ON rentals (car_id);
CREATE INDEX ix_rentals_car_status_dates ON rentals (car_id, status, start_date, end_date);
CREATE INDEX ix_rentals_clerk_id ON rentals (clerk_id);
CREATE INDEX ix_rentals_customer_id ON rentals (customer_id);
CREATE INDEX ix_rentals_request_time ON rentals (request_time);
CREATE INDEX ix_rentals_return_clerk_id ON rentals (return_clerk_id);
CREATE INDEX ix_rentals_status ON rentals (status);
CREATE INDEX ix_rentals_status_end_date ON rentals (status, end_date);
CREATE INDEX ix_rentals_user_id ON rentals (user_id);
CREATE INDEX ix_rentals_user_request_time ON rentals (user_id, request_time);
CREATE INDEX ix_users_address_id ON users (address_id);
CREATE UNIQUE INDEX ix_users_email ON users (email);
