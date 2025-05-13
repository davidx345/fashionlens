from datetime import datetime
from bson import ObjectId
from passlib.hash import pbkdf2_sha256
import logging

logger = logging.getLogger(__name__)

class User:
    """User model for authentication and profile management"""
    
    def __init__(self, db):
        """Initialize with database connection"""
        self.db = db
        self.collection = db.db.users
    
    def create_user(self, username, email, password):
        """Create a new user"""
        try:
            # Check if email already exists
            existing_user = self.collection.find_one({"email": email})
            if existing_user:
                return {"success": False, "message": "Email already registered"}
                
            user = {
                "username": username,
                "email": email,
                "password": pbkdf2_sha256.hash(password),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "wardrobe": [],
                "analyses": []
            }
            
            user_id = self.collection.insert_one(user).inserted_id
            return {"success": True, "user_id": str(user_id)}
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return {"success": False, "message": str(e)}
    
    def authenticate(self, email, password):
        """Authenticate a user"""
        try:
            user = self.collection.find_one({"email": email})
            
            if not user or not pbkdf2_sha256.verify(password, user["password"]):
                return None
            
            # Don't return password in response
            user_dict = dict(user)
            user_dict.pop("password", None)
            user_dict["_id"] = str(user_dict["_id"])
            return user_dict
        except Exception as e:
            logger.error(f"Error authenticating user: {e}")
            return None
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        try:
            user = self.collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user_dict = dict(user)
                user_dict.pop("password", None)
                user_dict["_id"] = str(user_dict["_id"])
                return user_dict
            return None
        except Exception as e:
            logger.error(f"Error retrieving user: {e}")
            return None

    def update_user(self, user_id, update_data):
        """Update user profile"""
        try:
            # Don't allow updating email or password through this method
            safe_data = {k: v for k, v in update_data.items() 
                        if k not in ["email", "password", "_id"]}
            
            safe_data["updated_at"] = datetime.utcnow()
            
            self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": safe_data}
            )
            return True
        except Exception as e:
            logger.error(f"Error updating user: {e}")
            return False
