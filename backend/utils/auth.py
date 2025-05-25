import jwt
import datetime
from functools import wraps
from flask import request, jsonify, current_app
from utils.db import get_db, serialize_doc
from bson.objectid import ObjectId

def generate_token(user_id):
    """Generate JWT token for user"""
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': str(user_id)
    }
    return jwt.encode(
        payload,
        current_app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )

def token_required(f):
    """Decorator to protect routes with JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Decode token
            data = jwt.decode(
                token, 
                current_app.config.get('SECRET_KEY'),
                algorithms=['HS256']
            )
            
            # Get user from database
            db = get_db()
            current_user = db.users.find_one({'_id': ObjectId(data['sub'])})
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': f'Authentication error: {str(e)}'}), 401
            
        # Add user to request context
        return f(current_user, *args, **kwargs)
    
    return decorated
