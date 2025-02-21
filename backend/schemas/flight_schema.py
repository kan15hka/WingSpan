from marshmallow import Schema, fields

class FlightSchema(Schema):
    id = fields.Int(dump_only=True)
    date = fields.Date(required=True)
    from_code = fields.Str(required=True)
    from_city = fields.Str(required=True)
    from_time = fields.Time(required=True)
    to_code = fields.Str(required=True)
    to_city = fields.Str(required=True)
    to_time = fields.Time(required=True)
    price = fields.Int(required=True)
    booked_seats = fields.Int()
    total_seats = fields.Int()

    airplane_id = fields.Int(required=True)

    airplane = fields.Nested("AirplaneSchema", dump_only=True )  # Serialize airplane details
    # airplane = fields.Nested("AirplaneSchema", dump_only=True ,exclude=("image_data",))  # Serialize airplane details
    crew = fields.List(fields.Nested("CrewSchema"), dump_only=True)  # Serialize assigned crew members
