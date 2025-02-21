from db import db
from datetime import datetime, UTC

class AirplaneModel(db.Model):
    __tablename__ = "airplanes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    model = db.Column(db.String(100), nullable=False)
    passenger_capacity = db.Column(db.Integer, nullable=False)
    crew_capacity = db.Column(db.Integer, nullable=False)
    manufacturer = db.Column(db.String(100), nullable=False)
    airline = db.Column(db.String(100), nullable=False)
    image_data = db.Column(db.LargeBinary, nullable=True)  # Store image as binary (BYTEA)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))

    flights = db.relationship("FlightModel", back_populates="airplane")
