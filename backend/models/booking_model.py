from db import db
from datetime import datetime, UTC

class BookingModel(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    flight_id = db.Column(db.Integer, db.ForeignKey("flights.id"), nullable=False)
    booking_date = db.Column(db.DateTime, default=lambda: datetime.now(UTC))
    seat_count=db.Column(db.Integer,nullable=False)

    user = db.relationship("UserModel", backref="bookings")
    flight = db.relationship("FlightModel", backref="bookings")
