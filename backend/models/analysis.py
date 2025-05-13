from datetime import datetime
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class Analysis:
    """Model for storing outfit analyses"""
    
    def __init__(self, db):
        """Initialize with database connection"""
        self.db = db
        self.collection = db.db.analyses
        self.users = db.db.users
    
    def create_analysis(self, user_id, image_url, results):
        """Create a new outfit analysis"""
        try:
            analysis = {
                "user_id": ObjectId(user_id),
                "image_url": image_url,
                "results": results,
                "created_at": datetime.utcnow(),
                "tags": results.get("tags", []),
                "rating": results.get("overall_score", 0)
            }
            
            # Insert the analysis
            analysis_id = self.collection.insert_one(analysis).inserted_id
            
            # Update the user's analyses array
            self.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {"analyses": ObjectId(analysis_id)}}
            )
            
            return str(analysis_id)
        except Exception as e:
            logger.error(f"Error creating analysis: {e}")
            raise
    
    def get_analysis(self, analysis_id):
        """Get a single analysis by ID"""
        try:
            analysis = self.collection.find_one({"_id": ObjectId(analysis_id)})
            if analysis:
                # Convert ObjectId to string
                analysis["_id"] = str(analysis["_id"])
                if "user_id" in analysis:
                    analysis["user_id"] = str(analysis["user_id"])
            return analysis
        except Exception as e:
            logger.error(f"Error retrieving analysis: {e}")
            return None
    
    def get_user_analyses(self, user_id, limit=10, skip=0):
        """Get analyses for a specific user"""
        try:
            cursor = self.collection.find(
                {"user_id": ObjectId(user_id)}
            ).sort("created_at", -1).skip(skip).limit(limit)
            
            analyses = []
            for analysis in cursor:
                analysis["_id"] = str(analysis["_id"])
                analysis["user_id"] = str(analysis["user_id"])
                analyses.append(analysis)
                
            return analyses
        except Exception as e:
            logger.error(f"Error retrieving analyses: {e}")
            return []
