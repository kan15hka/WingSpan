from marshmallow import Schema, fields

class FlightCrewSchema(Schema):
    id = fields.Int(dump_only=True)
    flight_id = fields.Int(required=True)
    crew_id = fields.Int(required=True)

    flight = fields.Nested("FlightSchema", dump_only=True)  # Include flight details
    crew = fields.Nested("CrewSchema", dump_only=True)  # Include crew member details
