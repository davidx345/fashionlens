from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import json
from datetime import datetime
import sys
import pathlib
import logging
import uuid
from pymongo.errors import ConnectionFailure
from bson import ObjectId

# Add backend directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from backend.config import Config
from backend.models.db import Database
from backend.services.vision_service import save_uploaded_file
from backend.services.ai_service import AIAnalysisService
from backend.models.user import User
from backend.models.wardrobe import WardrobeItem
from backend.models.analysis import Analysis

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up JWT
app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = Config.JWT_ACCESS_TOKEN_EXPIRES
jwt = JWTManager(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize services with error handling
try:
    db = Database()
    ai_service = AIAnalysisService()
    
    # Initialize models
    user_model = User(db)
    wardrobe_model = WardrobeItem(db)
    analysis_model = Analysis(db)
except ConnectionFailure:
    print("Failed to connect to MongoDB. Ensure MongoDB is running.")
    sys.exit(1)
except Exception as e:
    print(f"Error initializing services: {e}")
    sys.exit(1)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"})

# Add a MongoDB health check endpoint
@app.route('/api/db-health', methods=['GET'])
def db_health_check():
    """Check MongoDB connection health"""
    try:
        # Ping the database
        db.client.admin.command('ping')
        return jsonify({"status": "healthy", "message": "MongoDB connection is active"})
    except Exception as e:
        return jsonify({"status": "unhealthy", "message": str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
@jwt_required(optional=True)
def analyze_outfit():
    """
    Endpoint to analyze an outfit image
    """
    try:
        logger.debug("Received analysis request")
        
        # Check if file exists in request
        if 'file' not in request.files:
            logger.error("No file in request")
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        logger.debug(f"Received file: {file.filename}")
        
        if file.filename == '':
            logger.error("Empty filename")
            return jsonify({"error": "No file selected"}), 400
        
        # Save the uploaded file
        file_path = save_uploaded_file(file)
        if not file_path:
            logger.error("Failed to save file")
            return jsonify({"error": "Invalid file format"}), 400
        
        logger.debug(f"File saved to: {file_path}")
        
        # Process the image with AI
        logger.debug("Starting AI analysis")
        analysis_result = ai_service.analyze_outfit(file_path)
        
        # If AI analysis failed
        if not analysis_result or "error" in analysis_result:
            logger.error(f"AI analysis failed: {analysis_result}")
            return jsonify({"error": "Failed to analyze image"}), 500
        
        logger.debug("AI analysis completed successfully")
        
        # Get user_id if authenticated
        user_id = get_jwt_identity()
        
        # If user is authenticated, save analysis to their history
        if user_id:
            analysis_id = analysis_model.create_analysis(
                user_id,
                file_path,
                analysis_result
            )
            logger.debug(f"Analysis saved with ID: {analysis_id} for user: {user_id}")
        else:
            # Save analysis anonymously
            analysis_data = {
                "file_path": file_path,
                "analysis": analysis_result,
                "created_at": datetime.utcnow()
            }
            analysis_id = str(db.save_analysis(analysis_data).inserted_id)
            logger.debug(f"Analysis saved anonymously with ID: {analysis_id}")
        
        # Return the analysis results
        return jsonify({
            "id": analysis_id,
            "analysis": analysis_result,
            "isAuthenticated": bool(user_id)
        })
        
    except Exception as e:
        logger.error(f"Error in analyze_outfit: {e}", exc_info=True)
        return jsonify({"error": "Failed to analyze image"}), 500

@app.route('/api/analysis/<analysis_id>', methods=['GET'])
@jwt_required(optional=True)
def get_analysis(analysis_id):
    """
    Endpoint to retrieve a saved analysis
    """
    analysis = analysis_model.get_analysis(analysis_id)
    
    if not analysis:
        return jsonify({"error": "Analysis not found"}), 404
    
    # Check for user authentication
    current_user_id = get_jwt_identity()
    is_owner = False
    
    if current_user_id and "user_id" in analysis:
        is_owner = str(analysis["user_id"]) == str(current_user_id)
    
    return jsonify({
        "id": str(analysis["_id"]),
        "analysis": analysis["analysis"],
        "created_at": analysis["created_at"].isoformat(),
        "isOwner": is_owner
    })
    
@app.route('/api/analysis/history', methods=['GET'])
@jwt_required()
def get_analysis_history():
    """
    Get the current user's analysis history
    """
    user_id = get_jwt_identity()
    limit = request.args.get('limit', default=10, type=int)
    skip = request.args.get('skip', default=0, type=int)
    
    analyses = analysis_model.get_user_analyses(user_id, limit, skip)
    
    return jsonify({
        "success": True,
        "analyses": analyses,
        "count": len(analyses)
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.json
    
    # Basic validation
    if not data or not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
    result = user_model.create_user(data['username'], data['email'], data['password'])
    
    if result['success']:
        # Create access token
        access_token = create_access_token(identity=str(result['user_id']))
        return jsonify({
            'success': True, 
            'access_token': access_token
        }), 201
    else:
        return jsonify(result), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login a user"""
    data = request.json
    
    if not data or not all(k in data for k in ['email', 'password']):
        return jsonify({'success': False, 'message': 'Missing email or password'}), 400
        
    user = user_model.authenticate(data['email'], data['password'])
    
    if user:
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({
            'success': True,
            'access_token': access_token,
            'user': user
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Invalid email or password'
        }), 401

@app.route('/api/users/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get the current user's profile"""
    user_id = get_jwt_identity()
    user = user_model.get_user_by_id(user_id)
    
    if user:
        return jsonify({
            'success': True,
            'user': user
        })
    else:
        return jsonify({
            'success': False,
            'message': 'User not found'
        }), 404

@app.route('/api/users/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update the current user's profile"""
    user_id = get_jwt_identity()
    data = request.json
    
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
        
    success = user_model.update_user(user_id, data)
    
    if success:
        user = user_model.get_user_by_id(user_id)
        return jsonify({
            'success': True,
            'user': user
        })
    else:        return jsonify({
            'success': False,
            'message': 'Failed to update profile'
        }), 500

# Wardrobe management endpoints
@app.route('/api/wardrobe', methods=['POST'])
@jwt_required()
def add_wardrobe_item():
    """Add an item to the user's wardrobe"""
    user_id = get_jwt_identity()
    
    if 'image' not in request.files:
        return jsonify({
            'success': False,
            'message': 'No image uploaded'
        }), 400
    
    # Get form data
    name = request.form.get('name')
    category = request.form.get('category')
    
    if not name or not category:
        return jsonify({
            'success': False,
            'message': 'Missing name or category'
        }), 400
    
    # Save the uploaded image
    image = request.files['image']
    image_path = save_uploaded_file(image)
    
    if not image_path:
        return jsonify({
            'success': False,
            'message': 'Failed to save image'
        }), 500
    
    # Get additional properties if any
    properties = {}
    for key in request.form:
        if key not in ['name', 'category']:
            properties[key] = request.form[key]
    
    try:
        # Add item to wardrobe
        item_id = wardrobe_model.add_item(
            user_id, 
            name, 
            category, 
            image_path, 
            properties
        )
        
        return jsonify({
            'success': True,
            'item_id': item_id
        })
    except Exception as e:
        logger.error(f"Error adding wardrobe item: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to add item to wardrobe'
        }), 500

@app.route('/api/wardrobe', methods=['GET'])
@jwt_required()
def get_wardrobe():
    """Get the current user's wardrobe"""
    user_id = get_jwt_identity()
    category = request.args.get('category')
    
    try:
        items = wardrobe_model.get_user_wardrobe(user_id, category)
        
        return jsonify({
            'success': True,
            'items': items,
            'count': len(items)
        })
    except Exception as e:
        logger.error(f"Error retrieving wardrobe: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve wardrobe'
        }), 500

@app.route('/api/wardrobe/<item_id>', methods=['DELETE'])
@jwt_required()
def delete_wardrobe_item(item_id):
    """Delete an item from the user's wardrobe"""
    user_id = get_jwt_identity()
    
    try:
        success = wardrobe_model.delete_item(user_id, item_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Item deleted successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to delete item'
            }), 500
    except Exception as e:
        logger.error(f"Error deleting wardrobe item: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to delete item'
        }), 500

# AI feature endpoints
@app.route('/api/recommendations', methods=['GET'])
@jwt_required()
def get_outfit_recommendations():
    """Get outfit recommendations based on user's wardrobe"""
    user_id = get_jwt_identity()
    occasion = request.args.get('occasion')
    season = request.args.get('season')
    
    try:
        # Get the user's wardrobe
        wardrobe_items = wardrobe_model.get_user_wardrobe(user_id)
        
        if not wardrobe_items:
            return jsonify({
                'success': False,
                'message': 'Wardrobe is empty'
            }), 400
        
    # Generate recommendations using AI service
        recommendations = ai_service.get_outfit_recommendations(
            wardrobe_items, 
            occasion, 
            season
        )
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to generate recommendations'
        }), 500

@app.route('/api/bodyshape', methods=['POST'])
@jwt_required()
def analyze_body_shape():
    """Analyze body shape and provide style advice"""
    if 'image' not in request.files:
        return jsonify({
            'success': False,
            'message': 'No image uploaded'
        }), 400
    
    # Save uploaded image
    image = request.files['image']
    image_path = save_uploaded_file(image)
    if not image_path:
        return jsonify({
            'success': False,
            'message': 'Failed to save image'
        }), 500
    
    try:
        # Detect body shape using AI service
        results = ai_service.detect_body_shape(image_path)
        
        return jsonify({
            'success': True,
            'results': results
        })
    except Exception as e:
        logger.error(f"Error analyzing body shape: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to analyze body shape'
        }), 500

@app.route('/api/fabric', methods=['POST'])
@jwt_required()
def analyze_fabric():
    """Analyze fabric type and brand"""
    if 'image' not in request.files:
        return jsonify({
            'success': False,
            'message': 'No image uploaded'
        }), 400
    
    # Save uploaded image
    image = request.files['image']
    image_path = save_uploaded_file(image)
    if not image_path:
        return jsonify({
            'success': False,
            'message': 'Failed to save image'
        }), 500
    
    try:
        # Detect fabric and brand using AI service
        results = ai_service.detect_fabric_and_brand(image_path)
        
        return jsonify({
            'success': True,
            'results': results
        })
    except Exception as e:
        logger.error(f"Error analyzing fabric: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to analyze fabric'
        }), 500

@app.route('/api/multi-angle', methods=['POST'])
@jwt_required()
def analyze_multiple_angles():
    """Analyze outfit from multiple angles"""
    if 'images' not in request.files:
        return jsonify({
            'success': False,
            'message': 'No images uploaded'
        }), 400
    
    # Get all images from request
    images = request.files.getlist('images')
    
    if not images or len(images) < 2:
        return jsonify({
            'success': False,
            'message': 'At least 2 images required for multi-angle analysis'
        }), 400
    
    # Save all images
    image_paths = []
    for image in images:
        path = save_uploaded_file(image)
        if path:
            image_paths.append(path)
    
    if not image_paths:
        return jsonify({
            'success': False,
            'message': 'Failed to save any images'
        }), 500
    
    try:
        # Analyze multiple angles using AI service
        results = ai_service.analyze_multiple_angles(image_paths)
        
        # Store the analysis if user is authenticated
        user_id = get_jwt_identity()
        if user_id:
            analysis_id = analysis_model.create_analysis(user_id, image_paths[0], results)
            results['analysis_id'] = analysis_id
        
        return jsonify({
            'success': True,
            'results': results
        })
    except Exception as e:
        logger.error(f"Error analyzing multiple angles: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to analyze multiple angles'
        }), 500

@app.route('/api/seasonal', methods=['GET'])
@jwt_required()
def get_seasonal_suggestions():
    """Get seasonal outfit suggestions"""
    user_id = get_jwt_identity()
    season = request.args.get('season')
    location = request.args.get('location')
    
    if not season:
        return jsonify({
            'success': False,
            'message': 'Season parameter is required'
        }), 400
    
    try:
        # Get the user's wardrobe
        wardrobe_items = wardrobe_model.get_user_wardrobe(user_id)
        
        if not wardrobe_items:
            return jsonify({
                'success': False,
                'message': 'Wardrobe is empty'
            }), 400
          # Generate seasonal suggestions
        suggestions = ai_service.get_seasonal_suggestions(
            wardrobe_items, 
            season, 
            location
        )
        
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })
    except Exception as e:
        logger.error(f"Error generating seasonal suggestions: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to generate seasonal suggestions'
        }), 500

@app.route('/api/settings', methods=['POST'])
@jwt_required()
def save_user_settings():
    """Save user settings like theme preference"""
    user_id = get_jwt_identity()
    data = request.json
    
    if not data:
        return jsonify({
            'success': False,
            'message': 'No data provided'
        }), 400
    
    try:
        # Only allow specific settings to be saved
        allowed_settings = ['theme', 'notifications', 'language']
        safe_data = {k: v for k, v in data.items() if k in allowed_settings}
        
        # Update user settings
        success = user_model.update_user(user_id, {'settings': safe_data})
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Settings saved successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to save settings'
            }), 500
    except Exception as e:
        logger.error(f"Error saving user settings: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to save settings'
        }), 500

@app.route('/api/settings', methods=['GET'])
@jwt_required()
def get_user_settings():
    """Get user settings"""
    user_id = get_jwt_identity()
    
    try:
        user = user_model.get_user_by_id(user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        settings = user.get('settings', {})
        
        # Set defaults if not present
        if 'theme' not in settings:
            settings['theme'] = Config.DEFAULT_THEME
        
        return jsonify({
            'success': True,
            'settings': settings
        })
    except Exception as e:
        logger.error(f"Error retrieving user settings: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve settings'
        }), 500

if __name__ == '__main__':
    # Make sure upload folder exists
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=5000)