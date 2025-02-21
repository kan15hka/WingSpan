from functools import wraps

from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def role_required(required_role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args,**kwargs):
            verify_jwt_in_request()
            claims=get_jwt()
            if "role" in claims and claims["role"]==required_role:
                return fn(*args,**kwargs)
            return jsonify({"message" :"Access forbidden: Insufficient permissions"}),403
        return  wrapper
    return decorator