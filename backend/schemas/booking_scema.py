from marshmallow import Schema,fields

class BookingSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    flight_id = fields.Int(required=True)
    booking_date = fields.DateTime(dump_only=True)
    seat_count = fields.Int(required=True)
