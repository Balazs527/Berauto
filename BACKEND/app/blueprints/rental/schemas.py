from marshmallow import Schema, fields
from apiflask.validators import Email

class AddressSchema(Schema):
    id = fields.Integer()
    city = fields.String(required=True)
    street = fields.String(required=True)
    postalcode = fields.Integer(required=True)

class CustomerSchema(Schema):
    id = fields.Integer()
    name = fields.String(required=True)
    email = fields.String(validate=Email())
    phone = fields.String(required=True)
    address = fields.Nested(AddressSchema, required=True)

class CarShortSchema(Schema):
    id = fields.Integer()
    license_plate = fields.String()
    brand = fields.String()
    model = fields.String()
    category = fields.String()
    daily_price = fields.Float()

class RentalRequestSchema(Schema):
    car_id = fields.Integer(required=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)

class PublicRentalRequestSchema(RentalRequestSchema):
    customer = fields.Nested(CustomerSchema, required=True)

class RentalResponseSchema(Schema):
    id = fields.Integer()
    car = fields.Nested(CarShortSchema)
    user_id = fields.Integer()
    customer = fields.Nested(CustomerSchema)
    start_date = fields.Date()
    end_date = fields.Date()
    status = fields.String()
    request_time = fields.DateTime()
    accepted_at = fields.DateTime()
    handover_at = fields.DateTime()
    returned_at = fields.DateTime()
    start_odometer = fields.Integer()
    end_odometer = fields.Integer()
    total_price = fields.Float()

class InvoiceSchema(Schema):
    id = fields.Integer()
    rental_id = fields.Integer()
    invoice_number = fields.String()
    issue_date = fields.DateTime()
    net_amount = fields.Float()
    tax_amount = fields.Float()
    gross_amount = fields.Float()
    paid = fields.Boolean()

class HandoverSchema(Schema):
    start_odometer = fields.Integer(required=True)

class ReturnSchema(Schema):
    end_odometer = fields.Integer(required=True)
