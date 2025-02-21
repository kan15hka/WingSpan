from db import db
class FlightCrewModel(db.Model):
    __tablename__ = "flight_crew"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flight_id = db.Column(db.Integer, db.ForeignKey("flights.id"), nullable=False)
    crew_id = db.Column(db.Integer, db.ForeignKey("crew.id"), nullable=False)