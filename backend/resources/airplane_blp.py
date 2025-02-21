import base64
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt
from flask_smorest import Blueprint
from flask import request, jsonify
from psycopg2 import IntegrityError

from models import AirplaneModel, FlightModel
from schemas import AirplaneSchema
from db import db
from utils.auth_helpers import role_required

airplane_blp = Blueprint("Airplane", __name__, description="Operations on airplanes")


#GET AIRPLANES
@airplane_blp.route("/api/get_airplanes", methods=['GET'])
@airplane_blp.response(200, AirplaneSchema(many=True))
@jwt_required()
def get_airplanes():
    try:
        claims=get_jwt()
        if claims["role"] not in ["admin", "staff"]:
            return jsonify({"message": "Access forbidden: Unauthorised request."}), 403

        airplanes = AirplaneModel.query.all()

        # Convert binary image to base64 for frontend
        for airplane in airplanes:
            if airplane.image_data:
                airplane.image_data = base64.b64encode(airplane.image_data).decode("utf-8")

        return airplanes
    except Exception as e:
        return jsonify({"message": f"Error retrieving airplanes: {str(e)}", "code": 500}), 500


#ADD AIRPLANE
@airplane_blp.route("/api/add_airplane", methods=['POST'])
@jwt_required()
@role_required("admin")
def add_airplane():
    try:
        model = request.form.get("model")
        manufacturer = request.form.get("manufacturer")
        airline = request.form.get("airline")
        passenger_capacity = request.form.get("passenger_capacity")
        crew_capacity = request.form.get("crew_capacity")
        image = request.files.get("image")  # Get image file

        if not image:
            return jsonify({"message": "No image provided"}), 400

        image_data = image.read()  # Convert image to binary

        new_airplane = AirplaneModel(
            model=model,
            manufacturer=manufacturer,
            airline=airline,
            passenger_capacity=int(passenger_capacity),
            crew_capacity=int(crew_capacity),
            image_data=image_data,  # Store as binary in PostgreSQL
        )

        db.session.add(new_airplane)
        db.session.commit()

        return jsonify({"message": "Airplane added successfully!"}), 201

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500


#EDIT AIRPLANE
@airplane_blp.route("/api/edit_airplane/<int:airplane_id>", methods=['PUT'])
@jwt_required()
@role_required("admin")
def edit_airplane(airplane_id):
    try:
        db_airplane=AirplaneModel.query.get_or_404(airplane_id)

        db_airplane.model = request.form.get("model")
        db_airplane.manufacturer = request.form.get("manufacturer")
        db_airplane.airline = request.form.get("airline")
        db_airplane.passenger_capacity = request.form.get("passenger_capacity")
        db_airplane.crew_capacity = request.form.get("crew_capacity")

        image= request.files.get("image")  # Get image file

        if not image:
            return jsonify({"message": "No image provided"}), 400

        image_data = image.read()
        db_airplane.image_data = image_data
        db.session.commit()

        return {
            "message": "Note updated successfully.",
            "code": 200,
        }

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500


#DELETE AIRPLANE
@airplane_blp.route("/api/delete_airplane/<int:airplane_id>", methods=['DELETE'])
@jwt_required()
@role_required("admin")
def delete_airplane(airplane_id):
    try:
        db_airplane = AirplaneModel.query.get_or_404(airplane_id)
        db.session.delete(db_airplane)
        db.session.commit()
        return {
            "message": "Airplane deleted successfully.",
            "code": 200,
        }

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error deleting airplane: {str(e)}", "code": 500}), 500

#GET AIRPLANE IMAGE
@airplane_blp.route("/api/get_airplane_image/<int:airplane_id>", methods=['GET'])
@jwt_required()
def get_airplane_image(airplane_id):
    claims=get_jwt()
    if claims["role"] not in ["admin", "staff"]:
        return jsonify({"message": "Access forbidden: Unauthorised request."}), 403

    airplane = AirplaneModel.query.get(airplane_id)
    if not airplane or not airplane.image_data:
        return jsonify({"error": "Image not found"}), 404

    image_base64 = base64.b64encode(airplane.image_data).decode("utf-8")
    return jsonify({"image": f"data:image/png;base64,{image_base64}"})

# Get all available airplanes on the given date
@airplane_blp.route("/api/available_airplanes", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_available_airplanes():
    try:
        date_str = request.args.get('date')  # Get date in dd-mm-yyyy format

        if not date_str:
            return jsonify({"message": "Date parameter is required."}), 400

        # Convert the date string to a datetime object
        try:
            date = datetime.strptime(date_str, "%d-%m-%Y").date()
        except ValueError:
            return jsonify({"message": "Invalid date format. Please use dd-mm-yyyy."}), 400

        # Query airplanes that are not scheduled on the given date
        available_airplanes = db.session.query(AirplaneModel).filter(
            ~AirplaneModel.id.in_(
                db.session.query(FlightModel.airplane_id).filter(FlightModel.date == date)
            )
        ).all()

        # Serialize the results
        airplanes_data = [{"id": airplane.id, "model": airplane.model, "airline": airplane.airline,"passenger_capacity":airplane.passenger_capacity,"crew_capacity":airplane.crew_capacity,"manufacturer":airplane.manufacturer,"image_data": base64.b64encode(airplane.image_data).decode("utf-8")} for airplane in available_airplanes]

        return jsonify(airplanes_data), 200

    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500