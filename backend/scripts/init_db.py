from pymongo import MongoClient
import sys
import os

# Add the parent directory to system path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config

def init_mongodb():
    """Initialize MongoDB with required collections and indexes"""
    try:
        client = MongoClient(Config.MONGODB_URI)
        db = client[Config.MONGODB_DB]
        
        # Create analyses collection if it doesn't exist
        if 'analyses' not in db.list_collection_names():
            db.create_collection('analyses')
        
        # Create indexes
        db.analyses.create_index([('created_at', -1)])
        
        print("MongoDB initialized successfully")
        return True
    except Exception as e:
        print(f"Error initializing MongoDB: {e}")
        return False

if __name__ == "__main__":
    init_mongodb()