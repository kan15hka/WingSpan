from marshmallow import Schema, fields, validate

class AuthoritySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    reg_no = fields.Str()
    username = fields.Str(required=True)
    password = fields.Str(load_only=True, required=True,)
    role = fields.Str( validate=validate.OneOf(["admin", "staff"]))  # Must be 'admin' or 'staff'
    created_at = fields.DateTime(dump_only=True)
