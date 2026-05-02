from marshmallow import Schema, fields

class LogSchema(Schema):
    id = fields.Integer()
    user_id = fields.Integer()
    action = fields.String()
    entity = fields.String()
    entity_id = fields.Integer()
    created_at = fields.DateTime()
