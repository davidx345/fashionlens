import bcrypt
from bson.objectid import ObjectId
from utils.db import get_db, serialize_doc
import datetime

class User:
    """User model for authentication and profile management"""
    
    @staticmethod
    def create(name, email, password, is_oauth_user=False, oauth_provider=None, oauth_provider_account_id=None):
        """Create a new user"""
        db = get_db()
        
        # Check if user already exists
        if db.users.find_one({'email': email}):
            return None
            
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.datetime.utcnow(),
            'preferences': {
                'style_preferences': [],
                'favorite_colors': [],
                'disliked_styles': []
            },
            'is_oauth_user': is_oauth_user,
            'oauth_provider': oauth_provider,
            'oauth_provider_account_id': oauth_provider_account_id
        }
        
        # Insert user into database
        result = db.users.insert_one(user)
        user['_id'] = result.inserted_id
        
        return serialize_doc(user)
    
    @staticmethod
    def find_by_email(email):
        """Find a user by email"""
        db = get_db()
        user = db.users.find_one({'email': email})
        return serialize_doc(user) if user else None

    @staticmethod
    def authenticate(email, password):
        """Authenticate user with email and password"""
        db = get_db()
        
        # Find user by email
        user = db.users.find_one({'email': email})
        
        if not user:
            return None
            
        # If user is an OAuth user, don't allow password authentication
        if user.get('is_oauth_user', False):
            return None # Or handle differently, e.g., return an error specific to OAuth users
        
        # Check password
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return serialize_doc(user)
            
        return None
    
    @staticmethod
    def get_by_id(user_id):
        """Get user by ID"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        user = db.users.find_one({'_id': user_id})
        return serialize_doc(user)
    
    @staticmethod
    def update_profile(user_id, update_data):
        """Update user profile"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Remove password from update data if present
        if 'password' in update_data:
            del update_data['password']
            
        # Update user document
        result = db.users.update_one(
            {'_id': user_id},
            {'$set': update_data}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    def update_preferences(user_id, preferences):
        """Update user style preferences"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Update user preferences
        result = db.users.update_one(
            {'_id': user_id},
            {'$set': {'preferences': preferences}}
        )
        
        return result.modified_count > 0
