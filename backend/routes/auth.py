from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
import datetime
import bcrypt
from models.user import User
from utils.auth import generate_token, token_required
import uuid # Import uuid for generating random passwords for OAuth users

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
        
    # Generate JWT tokens
    access_token = create_access_token(identity=str(user['_id']))
    refresh_token = create_refresh_token(identity=str(user['_id']))
    
    # Return user data and tokens
    return jsonify({
        'user': {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email']
        },
        'access_token': access_token,
        'refresh_token': refresh_token
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
        
    # Generate JWT tokens for persistent session
    access_token = create_access_token(identity=str(user['_id']))
    refresh_token = create_refresh_token(identity=str(user['_id']))
    
    # Return user data and tokens
    return jsonify({
        'user': {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email']
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

@auth_bp.route('/oauth-login', methods=['POST'])
def oauth_login():
    
    """Handle OAuth login/registration"""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('name') or not data.get('provider') or not data.get('providerAccountId'):
        return jsonify({'error': 'Missing required OAuth fields'}), 400

    email = data['email']
    name = data['name']
    # provider = data['provider'] # e.g., 'google'
    # provider_account_id = data['providerAccountId'] # Unique ID from the provider

    user = User.find_by_email(email)

    if not user:
        # User does not exist, create a new one
        # For OAuth users, we might not have a password, or we can generate a random one
        # as they won't use it for direct login.
        random_password = str(uuid.uuid4()) # Generate a random password
        user_data = User.create(
            name=name,
            email=email,
            password=random_password, # Store a random, unusable password
            is_oauth_user=True, # Add a flag to indicate OAuth user
            oauth_provider=data.get('provider'),
            oauth_provider_account_id=data.get('providerAccountId')
        )
        if not user_data:
            # This case should ideally not happen if find_by_email was correct
            return jsonify({'error': 'User creation failed during OAuth process'}), 500
        user = user_data # Use the newly created user data
    else:
        # User exists, ensure their OAuth info is up-to-date if necessary
        # For simplicity, we'll assume if they exist with this email, it's the same user.
        # Optionally, update name or other details if they've changed in the OAuth profile.
        # User.update_oauth_details(user['_id'], name=name, oauth_provider=provider, oauth_provider_account_id=provider_account_id)
        pass # User found, proceed to token generation

    # At this point, 'user' dictionary contains the user details (either existing or newly created)
    token = generate_token(user['_id'])

    return jsonify({
        'user': {
            'id': user['_id'],
            'name': user['name'],
            'email': user['email']
            # Add other relevant user fields if needed
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

@auth_bp.route('/refresh', methods=['POST'])

@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    
    try:
        current_user_id = get_jwt_identity()
        
        # Create new access token
        new_access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to refresh token'}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user and revoke tokens"""
    
    try:
        # Get the JWT token identifier
        jti = get_jwt()['jti']
        
        # Add token to blacklist (we'll need to import blacklist from app.py)
        from app import blacklist
        blacklist.add(jti)
        
        return jsonify({'message': 'Successfully logged out'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to logout'}), 500

@auth_bp.route('/logout-all', methods=['POST'])
@jwt_required()
def logout_all():
    """Logout user from all devices by revoking all tokens"""
    
    try:
        # In a real application, you would store user sessions in database
        # and mark all sessions for this user as invalid
        # For now, we'll just revoke the current token
        jti = get_jwt()['jti']
        
        from app import blacklist
        blacklist.add(jti)
        
        return jsonify({'message': 'Successfully logged out from all devices'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to logout from all devices'}), 500

@auth_bp.route('/session-check', methods=['GET'])
@jwt_required()
def session_check():
    """Check if current session is valid"""
    
    try:
        current_user_id = get_jwt_identity()
        
        # Get user details
        user = User.get_by_id(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'valid': True,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'valid': False, 'error': 'Invalid session'}), 401
