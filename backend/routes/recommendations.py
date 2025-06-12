from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.recommendation import Recommendation
from backend.ai.recommender import OutfitRecommender

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/outfits', methods=['GET'])
@jwt_required()
def get_outfit_recommendations():
    """Get outfit recommendations for current user"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    count = request.args.get('count', 3, type=int)
    
    # Generate recommendations
    recommendations = OutfitRecommender.generate_outfit_recommendations(
        current_user['_id'],
        count
    )
    
    # Save recommendations to database
    saved_recommendations = []
    for recommendation in recommendations:
        saved = Recommendation.create_outfit_recommendation(
            current_user['_id'],
            recommendation
        )
        saved_recommendations.append({
            'id': saved['_id'],
            **recommendation
        })
    
    return jsonify(saved_recommendations), 200

@recommendations_bp.route('/seasonal', methods=['GET'])
@jwt_required()
def get_seasonal_recommendations():
    """Get seasonal recommendations for current user"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    season = request.args.get('season', 'fall')
    
    # Generate recommendations
    recommendations = OutfitRecommender.generate_seasonal_recommendations(
        current_user['_id'],
        season
    )
    
    return jsonify(recommendations), 200

@recommendations_bp.route('/shopping', methods=['GET'])
@jwt_required()
def get_shopping_recommendations():
    """Get shopping recommendations for current user"""
    # Get current user from JWT
    current_user_id = get_jwt_identity()
    from utils.db import get_db
    from bson import ObjectId
    db = get_db()
    current_user = db.users.find_one({'_id': ObjectId(current_user_id)})
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # This is a placeholder for future implementation
    return jsonify({
        'message': 'Shopping recommendations coming soon'
    }), 200

@recommendations_bp.route('/feedback', methods=['POST'])
@jwt_required()
def submit_feedback():
    """Submit feedback for a recommendation"""
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
    if not data or 'recommendationId' not in data or 'liked' not in data:
        return jsonify({'error': 'Missing required fields: recommendationId and liked are required'}), 400
        
    recommendation_id = data['recommendationId']
    liked = data['liked']
    comment = data.get('comment')
    
    # Construct feedback_data for the model
    feedback_data = {
        'liked': liked,
        'comment': comment
    }
    
    # Update recommendation feedback
    success = Recommendation.update_feedback(recommendation_id, feedback_data) 
    
    if not success:
        return jsonify({'error': 'Failed to update feedback'}), 500
        
    return jsonify({'message': 'Feedback submitted successfully'}), 200
