from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': current_user['_id'],
        'name': current_user['name'],
        'email': current_user['email'],
        'preferences': current_user.get('preferences', {})
    }), 200

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Validate input
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    # Update user profile
    success = User.update_profile(current_user['_id'], data)
    
    if not success:
        return jsonify({'error': 'Failed to update profile'}), 500
        
    # Get updated user
    updated_user = User.get_by_id(current_user['_id'])
    
    return jsonify({
        'id': updated_user['_id'],
        'name': updated_user['name'],
        'email': updated_user['email'],
        'preferences': updated_user.get('preferences', {})
    }), 200

@user_bp.route('/preferences', methods=['PUT'])
@jwt_required()
def update_preferences():
    """Update user style preferences"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Validate input
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    # Update user preferences
    success = User.update_preferences(current_user['_id'], data)
    
    if not success:
        return jsonify({'error': 'Failed to update preferences'}), 500
        
    # Get updated user
    updated_user = User.get_by_id(current_user['_id'])
    
    return jsonify({
        'preferences': updated_user.get('preferences', {})
    }), 200

@user_bp.route('/password', methods=['PUT'])
@jwt_required()
def update_password():
    """Update user password"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('currentPassword') or not data.get('newPassword'):
        return jsonify({'error': 'Current password and new password are required'}), 400
    
    # Validate new password strength
    new_password = data['newPassword']
    if len(new_password) < 8:
        return jsonify({'error': 'New password must be at least 8 characters long'}), 400
        
    # Update password
    success, message = User.update_password(
        current_user['_id'], 
        data['currentPassword'], 
        new_password
    )
    
    if not success:
        if "incorrect" in message:
            return jsonify({'error': message}), 400
        elif "OAuth" in message:
            return jsonify({'error': message}), 403
        else:
            return jsonify({'error': message}), 500
    
    return jsonify({'message': message}), 200
