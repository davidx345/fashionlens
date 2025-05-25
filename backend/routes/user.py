from flask import Blueprint, request, jsonify
from utils.auth import token_required
from models.user import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """Get user profile"""
    return jsonify({
        'id': current_user['_id'],
        'name': current_user['name'],
        'email': current_user['email'],
        'preferences': current_user.get('preferences', {})
    }), 200

@user_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update user profile"""
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
@token_required
def update_preferences(current_user):
    """Update user style preferences"""
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
