from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from sqlalchemy import URL
from resources import user_blp, crew_blp, airplane_blp, authority_blp, flight_blp, booking_blp, dashboard_blp
from blocklist import BLOCKLIST
from db import db
from datetime import timedelta
from flask_smorest import Api
from jwt_callbacks import (
    expired_token_callback,
    invalid_token_callback,
    missing_token_callback,
    needs_fresh_token_callback,
    revoked_token_callback,
    access_token_expires_callback,
    custom_error_handler,
    token_not_found_callback
)
import os
load_dotenv()
migrate = Migrate()

def create_app():
    app=Flask(__name__)
    CORS(app, origins=["http://localhost:5173", "https://wing-span.vercel.app"])

    url = URL.create(
        drivername="postgresql+psycopg2",
        username="postgres",
        password="Welcome@123!",
        host="localhost",
        port=5432,
        database="wingspan"
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "connect_args": {"sslmode": "require"}
    }
    app.config["API_TITLE"] = "Flask Rest API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
    # Increase maximum allowed request size (e.g., 50MB)
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB

    db.init_app(app)
    migrate.init_app(app, db)

    # with app.app_context():
    #     db.create_all()

    api=Api(app)

    api.register_blueprint(user_blp)
    api.register_blueprint(airplane_blp)
    api.register_blueprint(crew_blp)
    api.register_blueprint(authority_blp)
    api.register_blueprint(flight_blp)
    api.register_blueprint(booking_blp)
    api.register_blueprint(dashboard_blp)

    jwt=JWTManager(app)

    # Register the JWT callback functions
    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        return jwt_payload["jti"] in BLOCKLIST

    jwt.expired_token_loader( expired_token_callback)
    jwt.invalid_token_loader(invalid_token_callback)
    jwt.unauthorized_loader(missing_token_callback)
    jwt.needs_fresh_token_loader(needs_fresh_token_callback)
    jwt.revoked_token_loader(revoked_token_callback)
    jwt.expired_token_loader(access_token_expires_callback)

    return app