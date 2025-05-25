from flask import Blueprint, request, jsonify
from utils.auth import token_required
from models.recommendation import Recommendation
from ai.recommender import OutfitRecommender

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/outfits', methods=['GET'])
@token_required
def get_outfit_recommendations(current_user):
    """Get outfit recommendations for current user"""
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
@token_required
def get_seasonal_recommendations(current_user):
    """Get seasonal recommendations for current user"""
    season = request.args.get('season', 'fall')
    
    # Generate recommendations
    recommendations = OutfitRecommender.generate_seasonal_recommendations(
        current_user['_id'],
        season
    )
    
    return jsonify(recommendations), 200

@recommendations_bp.route('/shopping', methods=['GET'])
@token_required
def get_shopping_recommendations(current_user):
    """Get shopping recommendations for current user"""
    # This is a placeholder for future implementation
    return jsonify({
        'message': 'Shopping recommendations coming soon'
    }), 200

@recommendations_bp.route('/feedback', methods=['POST'])
@token_required
def submit_feedback(current_user):
    """Submit feedback for a recommendation"""
    data = request.get_json()
    
    # Validate input
    if not data or 'recommendation_id' not in data or 'feedback' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
        
    recommendation_id = data['recommendation_id']
    feedback = data['feedback']
    
    # Update recommendation feedback
    success = Recommendation.update_feedback(recommendation_id, feedback)
    
    if not success:
        return jsonify({'error': 'Failed to update feedback'}), 500
        
    return jsonify({'message': 'Feedback submitted successfully'}), 200
