from marshmallow import Schema,fields,validate

class CrewSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    role = fields.Str(required=True, validate=validate.OneOf(["pilot", "co-pilot", "flight-attendant"]))
    contact_number = fields.Str(required=True)
    license_number = fields.Str(allow_none=True)
    status = fields.Str(missing="active", validate=validate.OneOf(["active", "idle"]))