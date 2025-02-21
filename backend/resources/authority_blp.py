from datetime import timedelta

from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt, get_jwt_identity
from flask_smorest import Blueprint
import re
from flask import jsonify
from passlib.handlers.pbkdf2 import pbkdf2_sha256
from sqlalchemy.exc import IntegrityError

from blocklist import BLOCKLIST
from db import db
from models import AuthorityModel
from schemas import AuthoritySchema
from utils.auth_helpers import role_required

authority_blp=Blueprint("Authority",__name__)

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

def is_valid_role(role: str) -> bool:
    return role in {"admin", "staff"}

def generate_tokens(username:str,role:str):
    access_expires_in=timedelta(minutes=15)
    refresh_expires_in=timedelta(days=7)

    access_token=create_access_token(identity=username,fresh=True,expires_delta=access_expires_in,additional_claims={"role":role})
    refresh_token=create_refresh_token(identity=username,expires_delta=refresh_expires_in,additional_claims={"role": role})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "access_expires": access_expires_in.total_seconds(),
        "refresh_expires": refresh_expires_in.total_seconds(),
    }


@authority_blp.route("/api/add_authority", methods=['POST'])
@authority_blp.arguments(AuthoritySchema)  # Parses and validates input
@authority_blp.response(201)
@jwt_required()
@role_required("admin")
def add_authority(data):  # Ensure parameter matches parsed data
    name = data["name"]
    reg_no = data["reg_no"]
    username = data["username"].lower()
    password = data["password"]
    role = data["role"]

    if not is_strong_password(password):
        return jsonify({"message": "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number."}), 400

    if len(name) < 3:
        return jsonify({"message": "Name must be at least 3 characters long."}), 400

    if len(reg_no) < 3:
        return jsonify({"message": "Register Number must be at least 3 characters long."}), 400

    if len(username) < 3:
        return jsonify({"message": "Username must be at least 3 characters long."}), 400

    if not is_valid_role(role):
        return jsonify({"message": "User role is not valid."}), 400

    try:
        hashed_password = pbkdf2_sha256.hash(password)
        user_model = AuthorityModel(name=name, reg_no=reg_no, username=username, password=hashed_password, role=role)

        db.session.add(user_model)
        db.session.commit()

        return jsonify({
            "code": 201,
            "id": user_model.id,
            "name": user_model.name,
            "reg_no": user_model.reg_no,
            "username": user_model.username,
            "role": user_model.role,
            "message": "User SignUp successful.",
        }), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "User with that username or reg_no already exists."}), 409
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500


@authority_blp.route("/api/auth_sign_in",methods=['POST'])
@authority_blp.arguments(AuthoritySchema)
@authority_blp.response(200)
def authority_signin(user):
    try:
        username=user["username"].lower()
        password=user["password"]

        db_user=AuthorityModel.query.filter(AuthorityModel.username==username).first()

        if db_user and pbkdf2_sha256.verify(password,db_user.password):
            tokens=generate_tokens(username, db_user.role)
            return jsonify({
                "code": 200,
                "id": db_user.id,
                "role": db_user.role,
                "username": username,
                "name":db_user.name,
                "message": "Authority login successful.",
                **tokens,  # Unpack the token dictionary
            })
        return jsonify({"message": "Invalid username or password"}), 401

    except KeyError:
        return jsonify({"message":"Invalid request body. Ensure the credentials are valid"}),400
    except IntegrityError:
        return jsonify({"message":"User with that username already exists."}),409
    except Exception as e:
        return jsonify({"message":f"Internal server error: {str(e)}"}),500

@authority_blp.route("/api/auth_sign_out",methods=['POST'])
@authority_blp.response(200)
@jwt_required()
def authority_signout():
    try:
        # Get the JWT token from the request
        token=get_jwt()
        BLOCKLIST.add(token["jti"]) # "jti" is a unique identifier for the token
        return jsonify({"message":"Authority logout successful."}),200
    except Exception as e:
        return jsonify({"message":f"Internal server error: {str(e)}"}),500


@authority_blp.route("/api/auth_sign_out-refresh",methods=['POST'])
@authority_blp.response(200)
@jwt_required(refresh=True)
def authority_signout_refresh():
    try:
        # Get the JWT token from the request
        token = get_jwt()

        BLOCKLIST.add(token["jti"]) # "jti" is a unique identifier for the token
        return jsonify({"message":"Refresh token revoked."}),200
    except Exception as e:
        return jsonify({"message":f"Internal server error: {str(e)}"}),500


#Generate new access token
@authority_blp.route("/api/auth_refresh",methods=['POST'])
@jwt_required(refresh=True)
def authority_refresh_access_token():
    try:
        identity=get_jwt_identity() #The identity provided is username

        claims=get_jwt()
        role = claims.get("role", "user")  # Default role if not found

        access_expires_in=timedelta(minutes=15)
        new_access_token=create_access_token(identity=identity,fresh=False,expires_delta=access_expires_in,additional_claims={"role":role})

        return jsonify({"access_token":new_access_token,"access_expires":access_expires_in.total_seconds()})
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

#Get Authorities
@authority_blp.route("/api/get_authorities",methods=['GET'])
@authority_blp.response(200,AuthoritySchema(many=True))
@jwt_required()
def get_authorities():
    try:
        claims = get_jwt()
        if claims["role"] not in ["admin", "staff"]:
            return jsonify({"message": "Access forbidden: Unauthorised request."}), 403
        authorities = AuthorityModel.query.all()

        return authorities
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

#Get Authorities
@authority_blp.route("/api/delete_authority/<int:authority_id>",methods=['DELETE'])
@jwt_required()
@role_required("admin")
def delete_authority(authority_id):
    try:

        db_authority = AuthorityModel.query.get_or_404(authority_id)

        if db_authority.role =="admin":
            return jsonify({"message": "Admin cannot be deleted."}), 400

        db.session.delete(db_authority)
        db.session.commit()

        return jsonify({
            "message": "Authority deleted successfully.",
            "code": 200,
        })
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500


#Get Authorities
@authority_blp.route("/api/get_authority/<int:authority_id>",methods=['GET'])
@authority_blp.response(200,AuthoritySchema())
@jwt_required()
def get_authority(authority_id):
    try:
        claims = get_jwt()
        if claims["role"] not in ["admin", "staff"]:
            return jsonify({"message": "Access forbidden: Unauthorised request."}), 403
        authority = AuthorityModel.query.get(authority_id)

        return authority
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500
