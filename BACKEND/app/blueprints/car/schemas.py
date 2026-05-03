from marshmallow import Schema, fields
from apiflask.validators import Length, Range

class CarSchema(Schema):
    id = fields.Integer()
    license_plate = fields.String()
    brand = fields.String()
    model = fields.String()
    category = fields.String()
    year = fields.Integer()
    daily_price = fields.Float()
    odometer = fields.Integer()
    available = fields.Boolean()
    active = fields.Boolean()
    description = fields.String()

class CarRequestSchema(Schema):
    license_plate = fields.String(required=True, validate=Length(min=3, max=20))
    brand = fields.String(required=True)
    model = fields.String(required=True)
    category = fields.String(required=True)
    year = fields.Integer(required=True, validate=Range(min=1980))
    daily_price = fields.Float(required=True, validate=Range(min=1))
    odometer = fields.Integer(required=True, validate=Range(min=0))
    available = fields.Boolean(load_default=True)
    active = fields.Boolean(load_default=True)
    description = fields.String()

class CarUpdateSchema(Schema):
    license_plate = fields.String(validate=Length(min=3, max=20))
    brand = fields.String()
    model = fields.String()
    category = fields.String()
    year = fields.Integer(validate=Range(min=1980))
    daily_price = fields.Float(validate=Range(min=1))
    odometer = fields.Integer(validate=Range(min=0))
    available = fields.Boolean()
    active = fields.Boolean()
    description = fields.String()

class OdometerSchema(Schema):
    odometer = fields.Integer(required=True, validate=Range(min=0))

class AvailabilitySchema(Schema):
    available = fields.Boolean(required=True)
