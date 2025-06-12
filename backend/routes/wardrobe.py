from flask import Blueprint, request, jsonify, current_app
import os
import uuid
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.wardrobe import WardrobeItem

wardrobe_bp = Blueprint('wardrobe', __name__)

# Helper function to check allowed file extensions
def allowed_file(filename):
    """Check if file has allowed extension"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@wardrobe_bp.route('', methods=['GET'])
@jwt_required()
def get_wardrobe():
    """Get all wardrobe items for current user"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    items = WardrobeItem.get_by_user(current_user['_id'])
    
    return jsonify(items), 200

@wardrobe_bp.route('', methods=['POST'])
@jwt_required()
def add_item():
    """Add a new wardrobe item"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Check if request has form data
    if not request.form:
        return jsonify({'error': 'No form data provided'}), 400
        
    # Get form data
    name = request.form.get('name')
    category = request.form.get('category')
    color = request.form.get('color')
    season = request.form.get('season', 'all')
    
    # Validate input
    if not name or not category:
        return jsonify({'error': 'Missing required fields'}), 400
        
    # Check if request has image
    image_path = None
    if 'image' in request.files:
        file = request.files['image']
        
        if file and allowed_file(file.filename):
            # Create upload directory for user if it doesn't exist
            user_upload_dir = os.path.join(
                current_app.config['UPLOAD_FOLDER'],
                str(current_user['_id']),
                'wardrobe'
            )
            os.makedirs(user_upload_dir, exist_ok=True)
            
            # Generate unique filename
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(user_upload_dir, unique_filename)
            
            # Save file
            file.save(file_path)
            
            # Generate public URL
            image_path = f"/uploads/{current_user['_id']}/wardrobe/{unique_filename}"
    
    # Create item data
    item_data = {
        'name': name,
        'category': category,
        'color': color,
        'season': season,
        'image': image_path or f"/placeholder.svg?height=200&width=200&text={name.replace(' ', '+')}"
    }
    
    # Create wardrobe item
    item = WardrobeItem.create(current_user['_id'], item_data)
    
    return jsonify(item), 201

@wardrobe_bp.route('/<item_id>', methods=['GET'])
@jwt_required()
def get_item(item_id):
    """Get wardrobe item by ID"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    item = WardrobeItem.get_by_id(item_id)
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
        
    # Check if item belongs to current user
    if item['user_id'] != current_user['_id']:
        return jsonify({'error': 'Unauthorized'}), 403
        
    return jsonify(item), 200

@wardrobe_bp.route('/<item_id>', methods=['PUT'])
@jwt_required()
def update_item(item_id):
    """Update wardrobe item"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get item
    item = WardrobeItem.get_by_id(item_id)
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
        
    # Check if item belongs to current user
    if item['user_id'] != current_user['_id']:
        return jsonify({'error': 'Unauthorized'}), 403
        
    # Get form data
    name = request.form.get('name')
    category = request.form.get('category')
    color = request.form.get('color')
    season = request.form.get('season')
    
    # Create update data
    update_data = {}
    if name:
        update_data['name'] = name
    if category:
        update_data['category'] = category
    if color:
        update_data['color'] = color
    if season:
        update_data['season'] = season
        
    # Check if request has image
    if 'image' in request.files:
        file = request.files['image']
        
        if file and allowed_file(file.filename):
            # Create upload directory for user if it doesn't exist
            user_upload_dir = os.path.join(
                current_app.config['UPLOAD_FOLDER'],
                str(current_user['_id']),
                'wardrobe'
            )
            os.makedirs(user_upload_dir, exist_ok=True)
            
            # Generate unique filename
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(user_upload_dir, unique_filename)
            
            # Save file
            file.save(file_path)
            
            # Generate public URL
            update_data['image'] = f"/uploads/{current_user['_id']}/wardrobe/{unique_filename}"
    
    # Update item
    success = WardrobeItem.update(item_id, update_data)
    
    if not success:
        return jsonify({'error': 'Failed to update item'}), 500
        
    # Get updated item
    updated_item = WardrobeItem.get_by_id(item_id)
    
    return jsonify(updated_item), 200

@wardrobe_bp.route('/<item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    """Delete wardrobe item"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get item
    item = WardrobeItem.get_by_id(item_id)
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
        
    # Check if item belongs to current user
    if item['user_id'] != current_user['_id']:
        return jsonify({'error': 'Unauthorized'}), 403
        
    # Delete item
    success = WardrobeItem.delete(item_id)
    
    if not success:
        return jsonify({'error': 'Failed to delete item'}), 500
        
    return jsonify({'message': 'Item deleted successfully'}), 200
