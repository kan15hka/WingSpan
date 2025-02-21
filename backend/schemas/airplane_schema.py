from marshmallow import Schema, fields

class AirplaneSchema(Schema):
    id = fields.Int(dump_only=True)
    model = fields.Str(required=True)
    passenger_capacity = fields.Int(required=True)
    crew_capacity = fields.Int(required=True)
    manufacturer = fields.Str(required=True)
    airline = fields.Str(required=True)
    image_data = fields.Str(dump_only=True)  # This will be base64-encoded when retrieving
    created_at = fields.DateTime(dump_only=True)
