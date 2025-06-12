from bson.objectid import ObjectId
from utils.db import get_db, serialize_doc
import datetime

class Analysis:
    """Analysis model for outfit analysis results"""
    
    @staticmethod
    def create(user_id, analysis_data):
        """Create a new analysis record"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Create analysis document
        analysis = {
            'user_id': user_id,
            'images': analysis_data.get('images', []),
            'results': analysis_data.get('results', {}),
            'created_at': datetime.datetime.utcnow()
        }
        
        # Insert analysis into database
        result = db.analyses.insert_one(analysis)
        analysis['_id'] = result.inserted_id
        
        return serialize_doc(analysis)
    
    @staticmethod
    def get_by_user(user_id, limit=10):
        """Get analysis history for a user"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Find analyses by user ID, sorted by creation date
        analyses = list(
            db.analyses.find({'user_id': user_id})
            .sort('created_at', -1)
            .limit(limit)
        )
        
        return serialize_doc(analyses)
    
    @staticmethod
    def get_by_id(analysis_id):
        """Get analysis by ID"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(analysis_id, str):
            analysis_id = ObjectId(analysis_id)
            
        # Find analysis by ID
        analysis = db.analyses.find_one({'_id': analysis_id})
        return serialize_doc(analysis)
