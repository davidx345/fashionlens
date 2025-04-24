from pymongo import MongoClient
from backend.config import Config

def check_mongodb_connection():
    """Check MongoDB connection and print status"""
    try:
        client = MongoClient(Config.MONGODB_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("MongoDB connection successful!")
        print(f"Connected to database: {Config.MONGODB_DB}")
        return True
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        return False

if __name__ == "__main__":
    check_mongodb_connection()