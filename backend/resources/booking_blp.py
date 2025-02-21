from flask import  request,jsonify
from flask_smorest import Blueprint
from flask_jwt_extended import jwt_required, get_jwt
from db import db
from models import FlightModel, BookingModel, UserModel
from schemas import UserSchema
from utils.auth_helpers import role_required

booking_blp=Blueprint("Booking",__name__)

@booking_blp.route("/api/book_flight", methods=["POST"])
@jwt_required()
def book_flight():
    try:
        data = request.get_json()
        flight_id = data.get("flight_id")
        user_id = data.get("user_id")
        seats_to_book = data.get("seats", 1)

        if not user_id or not flight_id or not seats_to_book:
            return jsonify({"message": "Flight ID and number of seats are required."}), 400

        flight = FlightModel.query.get(flight_id)
        if not flight:
            return jsonify({"message": "Flight not found."}), 404

        # Check if enough seats are available
        if flight.total_seats - flight.booked_seats < seats_to_book:
            return jsonify({"message": "Not enough available seats."}), 400

        # Add the booked seats
        flight.booked_seats += seats_to_book

        # Create a booking entry
        new_booking = BookingModel(user_id=user_id, flight_id=flight_id, seat_count=seats_to_book)
        db.session.add(new_booking)
        db.session.commit()

        return jsonify({"message": "Flight booked successfully!", "booking_id": new_booking.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error booking flight: {str(e)}"}), 500


@booking_blp.route("/api/user_bookings/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user_bookings (user_id):
    try:

        if not user_id:
            return jsonify({"message": "User Id is required."}), 400

        bookings = BookingModel.query \
            .filter_by(user_id=user_id) \
            .join(BookingModel.flight) \
            .all()

        if not bookings:
            return jsonify({"message": "No bookings found for this user."}), 404

        # Format the response
        bookings_data = []
        for booking in bookings:
            flight = booking.flight
            airplane={
                "id":flight.airplane.id,
                "airline":flight.airplane.airline
            }
            bookings_data.append({
                "booking_id": booking.id,
                "booking_date": booking.booking_date.strftime("%Y-%m-%d %H:%M:%S"),
                "seat_count": booking.seat_count,
                "flight_id": flight.id,
                "date": flight.date.strftime("%Y-%m-%d"),
                "from_city": flight.from_city,
                "from_code": flight.from_code,
                "to_code": flight.to_code,
                "to_city": flight.to_city,
                "from_time": flight.from_time.strftime("%H:%M"),
                "to_time": flight.to_time.strftime("%H:%M"),
                "price": flight.price,
                "airplane_id": flight.airplane_id,
                "airplane":airplane
            })

        return jsonify({
            "user_id": user_id,
            "total_bookings": len(bookings),
            "bookings": bookings_data
        }), 200

    except Exception as e:
        return jsonify({"message": f"Error retrieving bookings: {str(e)}"}), 500


@booking_blp.route("/api/flight_bookings/<int:flight_id>", methods=["GET"])
@booking_blp.response(200, UserSchema(many=True))
@jwt_required()
def get_flight_bookings(flight_id):
    try:
        claims = get_jwt()
        if claims["role"] not in ["admin", "staff"]:
            return jsonify({"message": "Access forbidden: Unauthorized request."}), 403

        if not flight_id:
            return jsonify({"message": "Flight ID is required."}), 400

        # Get user IDs for the given flight
        booking_user_ids = db.session.query(BookingModel.user_id).filter(BookingModel.flight_id == flight_id).all()

        if not booking_user_ids:
            return jsonify({"message": "No bookings were made for the flight."}), 404

        # Extract user IDs from the query result
        user_ids = [user_id[0] for user_id in booking_user_ids]

        # Get user details
        users = db.session.query(UserModel).filter(UserModel.id.in_(user_ids)).all()
        return users

    except Exception as e:
        return jsonify({"message": f"Error retrieving bookings: {str(e)}"}), 500


# DELETE BOOKING
@booking_blp.route("/api/delete_booking/<int:booking_id>", methods=['DELETE'])
@booking_blp.response(200)
@jwt_required()
@role_required("admin")
def delete_booking(booking_id):
    try:
        booking = BookingModel.query.get(booking_id)
        if not booking:
            return jsonify({"message": "Booking not found", "code": 404}), 404

        booked_flight=FlightModel.query.get(booking.flight_id)

        if not booked_flight:
            return jsonify({"message": "Booked Flight not found", "code": 404}), 404

        booked_flight.booked_seats = max(0, booked_flight.booked_seats - booking.seat_count)

        db.session.delete(booking)
        db.session.commit()
        return {"message": "Booking deleted successfully", "code": 200}
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error Booking crew: {str(e)}", "code": 500}), 500