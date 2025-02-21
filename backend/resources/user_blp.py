from datetime import timedelta

from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt, get_jwt_identity
from flask_smorest import Blueprint
import re
from flask import jsonify
from passlib.handlers.pbkdf2 import pbkdf2_sha256
from sqlalchemy.exc import IntegrityError

from blocklist import BLOCKLIST
from db import db
from models import UserModel, BookingModel
from schemas import UserSchema
from utils.auth_helpers import role_required

user_blp=Blueprint("User",__name__)

def is_strong_password(password:str)->bool:
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]",password):
        return False
    if not re.search(r"[a-z]",password):
        return False
    if not re.search(r"\d",password):
        return False
    return True


def generate_tokens(username:str):
    access_expires_in=timedelta(minutes=15)
    refresh_expires_in=timedelta(days=7)

    access_token=create_access_token(identity=username,fresh=True,expires_delta=access_expires_in)
    refresh_token=create_refresh_token(identity=username,expires_delta=refresh_expires_in)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "access_expires": access_expires_in.total_seconds(),
        "refresh_expires": refresh_expires_in.total_seconds(),
    }



@user_blp.route("/api/pass_sign_up",methods=['POST'])
@user_blp.arguments(UserSchema)
@user_blp.response(200)
def user_signup(user):
    try:
        name=user["name"]
        username = user["username"].lower()
        password = user["password"]
        contact_number = user["contact_number"]
        dob = user["dob"]
        gender = user["gender"]
        nationality = user["nationality"]
    except KeyError:
        return jsonify({"message":"Invalid request body. Ensure the credentials are valid"}),400

    if not all ([contact_number,dob,gender,nationality]):
        return jsonify({"message": "Some user credentials are missing."}), 400

    if not is_strong_password(password):
        return jsonify({"message": "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number."}), 400

    if not username or len(username)<3:
        return jsonify({"message": "Username must be at least 3 characters long."}), 400


    user= UserModel.query.filter(UserModel.username==username).first()
    if user:
        return jsonify({"message": "User with that username already exists."}), 409

    try:
        hashed_password=pbkdf2_sha256.hash(password)

        user_model=UserModel(username=username,password=hashed_password,name=name,gender=gender,dob=dob,nationality=nationality,contact_number=contact_number)
        db.session.add(user_model)
        db.session.commit()

        tokens=generate_tokens(username)

        return jsonify({
            "code" : 201,
            "id": user_model.id,
            "name": name,
            "username": user_model.username,
            "message":"User SignUp successful.",
            **tokens,
        })
    except IntegrityError:
        return jsonify({"message":"User with that username already exists."}),409
    except Exception as e:
        return jsonify({"message":f"Internal server error: {str(e)}"}),500


@user_blp.route("/api/pass_sign_in",methods=['POST'])
@user_blp.arguments(UserSchema)
@user_blp.response(200)
def user_signin(user):
    try:
        username=user["username"].lower()
        password=user["password"]

        db_user=UserModel.query.filter(UserModel.username==username).first()

        if db_user and pbkdf2_sha256.verify(password,db_user.password):
            tokens=generate_tokens(username)
            return jsonify({
                "code": 200,
                "id": db_user.id,
                "name":db_user.name,
                "username": username,
                "message": "Passenger login successful.",
                **tokens,  # Unpack the token dictionary
            })
        return jsonify({"message": "Invalid username or password"}), 401

    except KeyError:
        return jsonify({"message":"Invalid request body. Ensure the credentials are valid"}),400
    except IntegrityError:
        return jsonify({"message":"User with that username already exists."}),409
    except Exception as e:
        return jsonify({"message":f"Internal server error: {str(e)}"}),500

@user_blp.route("/api/pass_sign_out",methods=['POST'])
@user_blp.response(200)
@jwt_required()
def user_signout():
    try:
        # Get the JWT token from the request
        token=get_jwt()
        BLOCKLIST.add(token["jti"]) # "jti" is a unique identifier for the token
        return jsonify({"message":"User logout successful."}),200
    except Exception as e:
        return jsonify({"message":f"Internal server error: {str(e)}"}),500


@user_blp.route("/api/pass_sign_out-refresh",methods=['POST'])
@user_blp.response(200)
@jwt_required(refresh=True)
def signout_refresh():
    try:
        # Get the JWT token from the request
        token = get_jwt()
        BLOCKLIST.add(token["jti"]) # "jti" is a unique identifier for the token
        return jsonify({"message":"Refresh token revoked."}),200
    except Exception as e:
        return jsonify({"message":f"Internal server error: {str(e)}"}),500


#Generate new access token
@user_blp.route("/api/pass_refresh",methods=['POST'])
@jwt_required(refresh=True)
def refresh_access_token():
    try:
        username=get_jwt_identity()
        access_expires_in=timedelta(minutes=15)
        new_access_token=create_access_token(identity=username,fresh=False,expires_delta=access_expires_in)

        return jsonify({"access_token":new_access_token,"access_expires":access_expires_in.total_seconds()})
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

@user_blp.route("/api/get_user/<int:user_id>", methods=['GET'])
@user_blp.response(200, UserSchema())
@jwt_required()
def get_user(user_id):
    try:
        user = UserModel.query.get(user_id)
        return user
    except Exception as e:
        return jsonify({"message": f"Error retrieving user: {str(e)}", "code": 500}), 500


@user_blp.route("/api/get_all_user", methods=['GET'])
@user_blp.response(200,UserSchema(many=True))
@jwt_required()
def get_all_users():
    try:
        claims = get_jwt()
        if claims["role"] not in ["admin", "staff"]:
            return jsonify({"message": "Access forbidden: Unauthorised request."}), 403
        users = UserModel.query.all()
        return users
    except Exception as e:
        return jsonify({"message": f"Error retrieving user: {str(e)}", "code": 500}), 500

@user_blp.route("/api/delete_user/<int:user_id>", methods=['DELETE'])
@user_blp.response(200)
@jwt_required()
@role_required("admin")
def delete_user(user_id):
    try:
        db_user = db.session.get(UserModel, user_id)
        if not db_user:
            return jsonify({"message": "User not found", "code": 404}), 404

        # Delete all user bookings efficiently
        BookingModel.query.filter_by(user_id=user_id).delete()

        # Delete the user
        db.session.delete(db_user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully", "code": 200}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error Deleting User: {str(e)}", "code": 500}), 500
