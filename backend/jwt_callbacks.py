from flask_jwt_extended import get_jwt
from flask import jsonify
from blocklist import BLOCKLIST

# 1. Token in blocklist check
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    return jwt_payload["jti"] in BLOCKLIST

# 2. Expired token callback
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"message": "The token has expired", "error": "expired_token"}), 401

# 3. Invalid token callback (signature verification failed)
def invalid_token_callback(error):
    return jsonify({"message": "Signature verification failed.", "error": "invalid_token"}), 401

# 4. Unauthorized (missing token or no valid token)
def missing_token_callback(error):
    return jsonify({"message": "Request does not contain an access token.", "error": "authorization_required"}), 401

# 5. Fresh token required callback
def needs_fresh_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "message": "Fresh token required for this operation",
        "error": "fresh_token_required"
    }), 401

# 6. Revoked token callback (token is in blocklist)
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "message": "The token has been revoked",
        "error": "revoked_token"
    }), 401

# 7. Access token expiration callback
def access_token_expires_callback(jwt_header, jwt_payload):
    return jsonify({
        "message": "The access token has expired",
        "error": "access_token_expired"
    }), 401

# 8. General JWT error handler
def custom_error_handler(error):
    return jsonify({
        "message": "JWT error occurred",
        "error": str(error)
    }), 400

# 9. Token not found callback (e.g., missing Authorization header)
def token_not_found_callback(error):
    return jsonify({
        "message": "Token not found in the request",
        "error": "token_not_found"
    }), 400
