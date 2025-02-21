from flask_jwt_extended import jwt_required, get_jwt
from flask_smorest import Blueprint
from flask import jsonify, request
from sqlalchemy import distinct

from models import CrewModel, FlightCrewModel,FlightModel
from schemas import CrewSchema
from db import db
from utils.auth_helpers import role_required
from datetime import datetime

crew_blp = Blueprint("Crew", __name__)

# GET CREW
@crew_blp.route("/api/get_crew", methods=['GET'])
@crew_blp.response(200, CrewSchema(many=True))
@jwt_required()
def get_crew():
    try:
        claims = get_jwt()
        if claims["role"] not in ["admin", "staff"]:
            return jsonify({"message": "Access forbidden: Unauthorised request."}), 403
        crew = CrewModel.query.all()
        return crew
    except Exception as e:
        return jsonify({"message": f"Error retrieving crew: {str(e)}", "code": 500}), 500

# ADD CREW
@crew_blp.route("/api/add_crew", methods=['POST'])
@crew_blp.response(201)
@crew_blp.arguments(CrewSchema())
@jwt_required()
@role_required("admin")
def add_crew(data):
    try:
        crew_model = CrewModel(
            name=data["name"],
            license_number=data["license_number"],
            contact_number=data["contact_number"],
            role=data["role"],
            status=data["status"]
        )
        db.session.add(crew_model)
        db.session.commit()
        return {"message": "Crew added successfully", "code": 201}
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error adding crew: {str(e)}", "code": 500}), 500

# UPDATE CREW
@crew_blp.route("/api/edit_crew/<int:crew_id>", methods=['PUT'])
@crew_blp.response(200)
@crew_blp.arguments(CrewSchema())
@jwt_required()
@role_required("admin")
def edit_crew(data, crew_id):
    try:
        crew = CrewModel.query.get(crew_id)
        if not crew:
            return jsonify({"message": "Crew not found", "code": 404}), 404

        # Updating the fields
        crew.name = data["name"]
        crew.license_number = data["license_number"]
        crew.contact_number = data["contact_number"]
        crew.role = data["role"]
        crew.status = data["status"]

        db.session.commit()
        return jsonify({"message": "Crew updated successfully", "code": 200})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating crew: {str(e)}", "code": 500}), 500

# DELETE CREW
@crew_blp.route("/api/delete_crew/<int:crew_id>", methods=['DELETE'])
@crew_blp.response(200)
@jwt_required()
@role_required("admin")
def delete_crew(crew_id):
    try:
        crew = CrewModel.query.get(crew_id)
        if not crew:
            return jsonify({"message": "Crew not found", "code": 404}), 404

        db.session.delete(crew)
        db.session.commit()
        return {"message": "Crew deleted successfully", "code": 200}
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error deleting crew: {str(e)}", "code": 500}), 500

# Get all available crew on the given date
@crew_blp.route("/api/available_crew", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_available_crew():
    try:
        date_str = request.args.get('date')  # Get date in dd-mm-yyyy format

        if not date_str:
            return jsonify({"message": "Date parameter is required."}), 400

        # Convert the date string to a datetime object
        try:
            date = datetime.strptime(date_str, "%d-%m-%Y").date()
        except ValueError:
            return jsonify({"message": "Invalid date format. Please use dd-mm-yyyy."}), 400

        assigned_crew_ids = (
            db.session.query(FlightCrewModel.crew_id)
            .join(FlightModel, FlightCrewModel.flight_id == FlightModel.id)
            .filter(FlightModel.date == date)
            .distinct()
        )

        available_crew=db.session.query(CrewModel).filter(
            ~CrewModel.id.in_(assigned_crew_ids)
        ).all()

        # Serialize the response
        crew_data = [
            {"id": crew.id, "name": crew.name, "role": crew.role,"license_number":crew.license_number,"contact_number":crew.contact_number,"status":crew.status,}
            for crew in available_crew
        ]

        return jsonify(crew_data), 200
        # available_crew=CrewModel.query.all()
        # return available_crew

    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500