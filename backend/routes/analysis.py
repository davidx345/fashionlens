from flask import Blueprint, request, jsonify, current_app
import os
import uuid
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.analysis import Analysis
from models.user import User
from ai.gemini_analyzer import GeminiAnalyzer

analysis_bp = Blueprint('analysis', __name__)

# Helper function to check allowed file extensions
def allowed_file(filename):
    """Check if file has allowed extension"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@analysis_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_images():
    """Upload images for analysis"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Check if request has files
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400
        
    files = request.files.getlist('images')
    
    # Check if files are empty
    if not files or files[0].filename == '':
        return jsonify({'error': 'No images selected'}), 400
        
    # Create upload directory for user if it doesn't exist
    user_upload_dir = os.path.join(
        current_app.config['UPLOAD_FOLDER'],
        str(current_user['_id'])
    )
    os.makedirs(user_upload_dir, exist_ok=True)
    
    # Save files
    saved_paths = []
    public_urls = []
    for file in files:
        if file and allowed_file(file.filename):
            # Generate unique filename
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(user_upload_dir, unique_filename)
            
            # Save file
            file.save(file_path)
            saved_paths.append(file_path)
            
            # Generate public URL
            public_url = f"/uploads/{current_user['_id']}/{unique_filename}"
            public_urls.append(public_url)
    
    if not saved_paths:
        return jsonify({'error': 'No valid images uploaded'}), 400
        
    # Analyze outfit using Gemini
    analysis_results = GeminiAnalyzer.analyze_outfit(saved_paths)
    
    # Save analysis to database
    analysis_data = {
        'images': public_urls,
        'results': analysis_results
    }
    
    analysis = Analysis.create(current_user['_id'], analysis_data)
    
    # Return analysis results
    return jsonify({
        'id': analysis['_id'],
        'images': public_urls,
        'results': analysis_results
    }), 201

@analysis_bp.route('/<analysis_id>', methods=['GET'])
@jwt_required()
def get_analysis(analysis_id):
    """Get analysis by ID"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    analysis = Analysis.get_by_id(analysis_id)
    
    if not analysis:
        return jsonify({'error': 'Analysis not found'}), 404
        
    # Check if analysis belongs to current user
    if analysis['user_id'] != current_user['_id']:
        return jsonify({'error': 'Unauthorized'}), 403
        
    return jsonify(analysis), 200

@analysis_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get analysis history for current user"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    limit = request.args.get('limit', 10, type=int)
    analyses = Analysis.get_by_user(current_user['_id'], limit)
    
    return jsonify(analyses), 200
