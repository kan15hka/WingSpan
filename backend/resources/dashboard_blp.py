from flask_jwt_extended import jwt_required, get_jwt
from flask_smorest import Blueprint
from flask import jsonify
from datetime import date, UTC
from sqlalchemy import func
from db import db
from models import AirplaneModel, FlightModel, BookingModel, UserModel, CrewModel, FlightCrewModel

dashboard_blp = Blueprint("Dashboard", __name__)


@dashboard_blp.route("/api/get_dashboard_data", methods=['GET'])
@jwt_required()
def get_dashboard_data():
    try:
        claims = get_jwt()
        if claims["role"] not in ["admin", "staff"]:
            return jsonify({"message": "Access forbidden: Unauthorized request."}), 403

        today = date.today()

        # Total airplanes
        total_airplanes = db.session.query(func.count(AirplaneModel.id)).scalar()

        # Total users
        total_users = db.session.query(func.count(UserModel.id)).scalar()

        # Total crew members and available crew
        total_crew = db.session.query(func.count(CrewModel.id)).scalar()
        assigned_crew = db.session.query(func.count(func.distinct(FlightCrewModel.crew_id))).scalar()
        available_crew = total_crew-assigned_crew

        # Total flights today
        total_flights_today = db.session.query(func.count(FlightModel.id)).filter(FlightModel.date == today).scalar()

        # Revenue calculations
        total_revenue = db.session.query(func.sum(BookingModel.seat_count * FlightModel.price)) \
                            .join(FlightModel, BookingModel.flight_id == FlightModel.id) \
                            .scalar() or 0

        today_revenue = db.session.query(func.sum(BookingModel.seat_count * FlightModel.price)) \
                            .join(FlightModel, BookingModel.flight_id == FlightModel.id) \
                            .filter(FlightModel.date == today) \
                            .scalar() or 0

        revenue_per_date = db.session.query(FlightModel.date, func.sum(BookingModel.seat_count * FlightModel.price)) \
            .join(BookingModel, BookingModel.flight_id == FlightModel.id) \
            .group_by(FlightModel.date) \
            .all()

        revenue_per_date_dict = {str(r_date): revenue for r_date, revenue in revenue_per_date}

        flights_per_date = db.session.query(FlightModel.date, func.count(FlightModel.id)) \
            .group_by(FlightModel.date) \
            .all()

        flights_per_date_dict={str(f_date): flight_count for f_date, flight_count in flights_per_date}

        # Seats (booked and total)
        total_seats = db.session.query(func.sum(FlightModel.total_seats)).scalar() or 0
        booked_seats = db.session.query(func.sum(FlightModel.booked_seats)).scalar() or 0



        return jsonify({
            "total_airplanes": total_airplanes,
            "total_users": total_users,
            "crew":{
                "assigned":assigned_crew,
                "total":total_crew,
                "available":available_crew
            },
            "total_flights_today": total_flights_today,
            "revenue": {
                "overall": total_revenue,
                "today": today_revenue,
                "per_date": revenue_per_date_dict
            },
            "flights_per_date":flights_per_date_dict,
            "seats": {
                "booked": booked_seats,
                "total": total_seats
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
