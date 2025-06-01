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
