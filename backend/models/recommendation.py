from bson.objectid import ObjectId
from backend.utils.db import get_db, serialize_doc
import datetime

class Recommendation:
    """Recommendation model for outfit and item recommendations"""
    
    @staticmethod
    def create_outfit_recommendation(user_id, outfit_data):
        """Create a new outfit recommendation"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Create recommendation document
        recommendation = {
            'user_id': user_id,
            'type': 'outfit',
            'name': outfit_data.get('name'),
            'description': outfit_data.get('description'),
            'score': outfit_data.get('score'),
            'items': outfit_data.get('items', []),
            'image': outfit_data.get('image'),
            'created_at': datetime.datetime.utcnow(),
            'feedback': None
        }
        
        # Insert recommendation into database
        result = db.recommendations.insert_one(recommendation)
        recommendation['_id'] = result.inserted_id
        
        return serialize_doc(recommendation)
    
    @staticmethod
    def get_outfit_recommendations(user_id, limit=10):
        """Get outfit recommendations for a user"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Find outfit recommendations by user ID
        recommendations = list(
            db.recommendations.find({
                'user_id': user_id,
                'type': 'outfit'
            })
            .sort('created_at', -1)
            .limit(limit)
        )
        
        return serialize_doc(recommendations)
    
    @staticmethod
    def get_seasonal_recommendations(user_id, season):
        """Get seasonal recommendations for a user"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Find seasonal recommendations by user ID and season
        recommendations = list(
            db.recommendations.find({
                'user_id': user_id,
                'type': 'seasonal',
                'season': season
            })
            .sort('created_at', -1)
        )
        
        return serialize_doc(recommendations)
    
    @staticmethod
    def update_feedback(recommendation_id, feedback):
        """Update recommendation feedback"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(recommendation_id, str):
            recommendation_id = ObjectId(recommendation_id)
            
        # Update recommendation document
        result = db.recommendations.update_one(
            {'_id': recommendation_id},
            {'$set': {'feedback': feedback}}
        )
        
        return result.modified_count > 0
