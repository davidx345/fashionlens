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
        return json.JSONEncoder.default(self, o)

def initialize_db(app):
    """Initialize MongoDB connection"""
    global client, db
    mongo_uri = app.config['MONGO_URI']
    
    try:
        # Set serverSelectionTimeoutMS to avoid hanging indefinitely
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        # Test connection
        client.admin.command('ping')
        # Extract database name from URI or use default
        if '/' in mongo_uri and mongo_uri.split('/')[-1]:
            db_name = mongo_uri.split('/')[-1]
        else:
            db_name = 'fashion_analysis'  # Default database name
        
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
