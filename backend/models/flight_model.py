from db import db

class FlightModel(db.Model):
    __tablename__ = "flights"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, nullable=False)
    from_code = db.Column(db.String(100), nullable=False)
    from_city = db.Column(db.String(100), nullable=False)
    from_time = db.Column(db.Time, nullable=False)
    to_code = db.Column(db.String(100), nullable=False)
    to_city = db.Column(db.String(100), nullable=False)
    to_time = db.Column(db.Time, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    booked_seats = db.Column(db.Integer,nullable=False,default=0)
    total_seats = db.Column(db.Integer,nullable=False,default=0)



    airplane_id = db.Column(db.Integer, db.ForeignKey("airplanes.id"), nullable=False)

    airplane = db.relationship("AirplaneModel", back_populates="flights")
    crew = db.relationship("CrewModel",secondary="flight_crew", back_populates="flights")
