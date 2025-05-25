from flask import Blueprint, request, jsonify
import datetime
import bcrypt
from models.user import User
from utils.auth import generate_token, token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
        
    # Create user
    user = User.create(
        name=data['name'],
        email=data['email'],
        password=data['password']
    )
    
    if not user:
        return jsonify({'error': 'User already exists'}), 409
        
    # Generate token
    token = generate_token(user['_id'])
    
    # Return user data and token
    return jsonify({
        'user': {
            'id': user['_id'],
            'name': user['name'],
            'email': user['email']
        },
        'token': token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
        
    # Authenticate user
    user = User.authenticate(
        email=data['email'],
        password=data['password']
    )
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
        
    # Generate token
    token = generate_token(user['_id'])
    
    # Return user data and token
    return jsonify({
        'user': {
            'id': user['_id'],
            'name': user['name'],
            'email': user['email']
        },
        'token': token
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def me(current_user):
    """Get current user"""
    return jsonify({
        'user': {
            'id': current_user['_id'],
            'name': current_user['name'],
            'email': current_user['email']
        }
    }), 200
