from db import db

class CrewModel(db.Model):
    __tablename__ = "crew"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    contact_number = db.Column(db.String(20), unique=True, nullable=False)
    license_number = db.Column(db.String(50), unique=True, nullable=True)
    status = db.Column(db.String(20), default="active", nullable=False)

    flights = db.relationship("FlightModel",secondary="flight_crew",  back_populates="crew")
