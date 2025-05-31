from pymongo import MongoClient
import os
from bson.objectid import ObjectId
import json
from datetime import datetime

# MongoDB client
client = None
db = None

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        if isinstance(o, bytes): # Add this condition
            return o.decode('utf-8') # Decode bytes to string
        return json.JSONEncoder.default(self, o)

def initialize_db(app):
    """Initialize MongoDB connection"""
    global client, db
    mongo_uri = app.config['MONGO_URI']
    db_name_env = os.getenv('MONGO_DB_NAME') # Get DB name from .env

    try:
        # Set serverSelectionTimeoutMS to avoid hanging indefinitely
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        # Test connection
        client.admin.command('ping')
        
        # Use MONGO_DB_NAME from .env if available, otherwise parse from URI or use default
        if db_name_env:
            db_name = db_name_env
        elif '/' in mongo_uri and '?' in mongo_uri: # Ensure there's a path part before query params
            path_part = mongo_uri.split('/')[-1]
            db_name = path_part.split('?')[0] if '?' in path_part else path_part
            if not db_name: # Handle cases like mongodb+srv://...mongodb.net/?retryWrites...
                 db_name = 'fashion_analysis' # Default if parsing fails to get a name
        else:
            db_name = 'fashion_analysis'  # Default database name if not in URI path and not in .env
        
        db = client[db_name]
        
        # Create indexes for better performance
        db.users.create_index('email', unique=True)
        db.wardrobe_items.create_index('user_id')
        db.analyses.create_index('user_id')
        
        print(f"Connected to MongoDB Atlas: {db_name}")
        return db
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise

def get_db():
    """Get database instance"""
    global db
    if db is None:
        raise Exception("Database not initialized")
    return db

def serialize_doc(doc):
    """Serialize MongoDB document to JSON"""
    if doc is None:
        return None
    return json.loads(JSONEncoder().encode(doc))
