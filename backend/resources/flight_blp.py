import base64
from flask_jwt_extended import jwt_required, get_jwt
from flask_smorest import Blueprint
from flask import jsonify, request
from models import FlightModel, FlightCrewModel, AirplaneModel,CrewModel
from schemas import  FlightSchema
from db import db
from utils.auth_helpers import role_required

flight_blp = Blueprint("Flight", __name__)

# GET FLIGHTS
@flight_blp.route("/api/get_flights", methods=['GET'])
@flight_blp.response(200, FlightSchema(many=True))
@jwt_required()
def get_flights():
    try:
        claims=get_jwt()
        if claims["role"] not in ["admin", "staff"]:
            return jsonify({"message": "Access forbidden: Unauthorised request."}), 403

        flights = FlightModel.query.all()
        flights_data = []

        for flight in flights:
            flight_data = {
                "id": flight.id,
                "date": flight.date.strftime("%Y-%m-%d"),  # Ensure date is string
                "from_city": flight.from_city,
                "from_code": flight.from_code,
                "from_time": flight.from_time.strftime("%H:%M:%S"),  # Convert time to string
                "to_city": flight.to_city,
                "to_code": flight.to_code,
                "to_time": flight.to_time.strftime("%H:%M:%S"),
                "price": flight.price,
                "booked_seats": flight.booked_seats,
                "total_seats": flight.total_seats,
                "crew": None,
                "airplane": None  # Default value
            }
            flight_crew=[]
            if flight.crew:
                for crew in flight.crew:
                    flight_crew.append({
                        "id":crew.id,
                        "name":crew.name,
                        "role":crew.role,
                        "contact_number":crew.contact_number,
                        "license_number":crew.license_number,
                        "status":crew.status
                    })
            flight_data["crew"]=flight_crew

            if flight.airplane:
                flight_data["airplane"] = {
                    "id": flight.airplane.id,
                    "model": flight.airplane.model,
                    "manufacturer": flight.airplane.manufacturer,
                    "airline": flight.airplane.airline,
                    "passenger_capacity": flight.airplane.passenger_capacity,
                    "crew_capacity": flight.airplane.crew_capacity,
                    "image_data": base64.b64encode(flight.airplane.image_data).decode(
                        "utf-8") if flight.airplane.image_data else None
                }

            flights_data.append(flight_data)

        return jsonify(flights_data), 200

        # #The flights returned here do not contain image_data(in airplane json) as its excluded.
        # #image data is fetched in diff api call
        # flights = FlightModel.query.all()
        # return flights
    except Exception as e:
        return jsonify({"message": f"Error retrieving flights: {str(e)}", "code": 500}), 500

#ADD FLIGHT
@flight_blp.route("/api/add_flight",methods=['POST'])
@flight_blp.response(200,FlightSchema)
@jwt_required()
@role_required("admin")
def add_flight():
    try:
        data = request.get_json()

        airplane_id = data.get("airplane_id")
        crew_ids = data.get("crew_ids", [])
        date = data.get("date")
        from_city = data.get("from_city")
        from_code = data.get("from_code")
        from_time = data.get("from_time")
        to_city = data.get("to_city")
        to_code = data.get("to_code")
        to_time = data.get("to_time")
        price = data.get("price")

        if not all([airplane_id, date, from_city, from_code, to_code, to_city, from_time, to_time, price]):
            return jsonify({"message": "Missing required fields."}), 400

        existing_flight = FlightModel.query.filter_by(airplane_id=airplane_id, date=date).first()
        if existing_flight:
            return jsonify({"message": "This airplane is already assigned to another flight on this date."}), 400

        # Ensure crew members are available
        assigned_crew_ids = (
            db.session.query(FlightCrewModel.crew_id)
            .join(FlightModel, FlightCrewModel.flight_id == FlightModel.id)
            .filter(FlightModel.date == date)
            .distinct()
        )

        for crew_id in crew_ids:
            if crew_id in [crew.crew_id for crew in assigned_crew_ids]:
                return jsonify(
                    {
                        "message": f"Crew member with ID {crew_id} is already assigned to another flight on this date."}), 400

        airplane=AirplaneModel.query.get(airplane_id)
        airplane_passenger_capacity=airplane.passenger_capacity

        new_flight = FlightModel(
            airplane_id=airplane_id,
            date=date,
            from_city=from_city,
            from_code=from_code,
            from_time=from_time,
            to_city=to_city,
            to_code=to_code,
            to_time=to_time,
            price=price,
            total_seats=airplane_passenger_capacity
        )
        db.session.add(new_flight)
        db.session.commit()

        for crew_id in crew_ids:
            flight_crew = FlightCrewModel(flight_id=new_flight.id, crew_id=crew_id)
            db.session.add(flight_crew)
        db.session.commit()
        return new_flight, 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error adding flight: {str(e)}", "code": 500}), 500

@flight_blp.route("/api/delete_flight/<int:flight_id>", methods=['DELETE'])
@jwt_required()
@role_required("admin")
def delete_flight(flight_id):
    try:
        if not flight_id:
            return jsonify({"message": "Flight ID is required"}), 400

        db_flight = FlightModel.query.get(flight_id)
        if not db_flight:
            return jsonify({"message": "Flight not found"}), 404

        FlightCrewModel.query.filter_by(flight_id=flight_id).delete()

        # Delete the flight
        db.session.delete(db_flight)

        # Commit once
        db.session.commit()

        return jsonify({"message": "Flight deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error deleting flight: {str(e)}"}), 500

#EDIT FIELD
@flight_blp.route("/api/edit_flight/<int:flight_id>", methods=['PUT'])
@flight_blp.response(200, FlightSchema)
@jwt_required()
@role_required("admin")
def edit_flight(flight_id):
    try:
        data = request.get_json()

        airplane_id = data.get("airplane_id")
        crew_ids = data.get("crew_ids", [])
        date = data.get("date")
        from_city = data.get("from_city")
        from_code = data.get("from_code")
        from_time = data.get("from_time")
        to_city = data.get("to_city")
        to_code = data.get("to_code")
        to_time = data.get("to_time")
        price = data.get("price")

        if not all([airplane_id, date, from_city, from_code, to_code, to_city, from_time, to_time, price]):
            return jsonify({"message": "Missing required fields."}), 400

        db_flight = FlightModel.query.get(flight_id)
        if not db_flight:
            return jsonify({"message": "Flight not found", "code": 404}), 404

        # Update flight details
        db_flight.airplane_id = airplane_id
        db_flight.date = date
        db_flight.from_city = from_city
        db_flight.from_code = from_code
        db_flight.from_time = from_time
        db_flight.to_city = to_city
        db_flight.to_code = to_code
        db_flight.to_time = to_time
        db_flight.price = price
        db.session.commit()

        db_flight_crews = (
            db.session.query(FlightCrewModel)
            .filter(FlightCrewModel.flight_id == flight_id)
            .distinct()
            .all()  # Convert query object into a list of results
        )

        # Ensure the number of crew members matches the provided list
        if len(db_flight_crews) != len(crew_ids):
            return jsonify({"message": "Mismatch in crew count", "code": 400}), 400

        # Update crew members
        for i in range(len(db_flight_crews)):
            db_flight_crews[i].crew_id = crew_ids[i]

        db.session.commit()

        return jsonify({"message": "Crew updated successfully", "code": 200})

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating flight: {str(e)}", "code": 500}), 500


@flight_blp.route("/api/pass_get_flights", methods=['GET'])
@flight_blp.response(200)
@jwt_required()
def get_passenger_flights():
    try:
        flights = FlightModel.query.all()
        flights_data = []

        for flight in flights:
            flight_data = {
                "id": flight.id,
                "date": flight.date.strftime("%Y-%m-%d"),  # Ensure date is string
                "from_city": flight.from_city,
                "from_code": flight.from_code,
                "from_time": flight.from_time.strftime("%H:%M:%S"),  # Convert time to string
                "to_city": flight.to_city,
                "to_code": flight.to_code,
                "to_time": flight.to_time.strftime("%H:%M:%S"),
                "price": flight.price,
                "booked_seats": flight.booked_seats
            }
            if flight.airplane:
                flight_data["airplane"] = {
                    "id": flight.airplane.id,
                    "model": flight.airplane.model,
                    "manufacturer": flight.airplane.manufacturer,
                    "airline": flight.airplane.airline,
                    "passenger_capacity": flight.airplane.passenger_capacity,
                    "crew_capacity": flight.airplane.crew_capacity,
                    "image_data": base64.b64encode(flight.airplane.image_data).decode(
                        "utf-8") if flight.airplane.image_data else None
                }
            flights_data.append(flight_data)

        return jsonify(flights_data), 200

    except Exception as e:
        return jsonify({"message": f"Error retrieving flights: {str(e)}", "code": 500}), 500
