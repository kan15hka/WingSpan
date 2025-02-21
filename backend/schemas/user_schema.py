from marshmallow import Schema,fields


class UserSchema(Schema):
    id=fields.Int()
    username=fields.Str()
    password=fields.Str()
    role=fields.Str()
    name=fields.Str()
    contact_number=fields.Str()
    dob=fields.Str()
    gender=fields.Str()
    nationality=fields.Str()


