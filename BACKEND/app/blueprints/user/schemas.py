from marshmallow import Schema, fields
from apiflask.validators import Email, Length

class RoleSchema(Schema):
    id = fields.Integer()
    name = fields.String()

class AddressSchema(Schema):
    id = fields.Integer()
    city = fields.String(required=True)
    street = fields.String(required=True)
    postalcode = fields.Integer(required=True)

class UserRequestSchema(Schema):
    name = fields.String(required=True, validate=Length(min=2, max=80))
    email = fields.String(required=True, validate=Email())
    password = fields.String(required=True, validate=Length(min=6))
    phone = fields.String(required=True)
    address = fields.Nested(AddressSchema, required=True)

class UserLoginSchema(Schema):
    email = fields.String(required=True, validate=Email())
    password = fields.String(required=True)

class UserUpdateSchema(Schema):
    phone = fields.String()
    address = fields.Nested(AddressSchema)

class PayloadSchema(Schema):
    user_id = fields.Integer()
    roles = fields.List(fields.Nested(RoleSchema))
    exp = fields.Integer()

class UserResponseSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    email = fields.String()
    phone = fields.String()
    address = fields.Nested(AddressSchema)
    roles = fields.List(fields.Nested(RoleSchema))
    token = fields.String()
