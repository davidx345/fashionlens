from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from backend.config import Config
import logging

class Database:
    def __init__(self):
        try:
            # Set a shorter timeout for faster feedback
            self.client = MongoClient(Config.MONGODB_URI, serverSelectionTimeoutMS=5000)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[Config.MONGODB_DB]
            self.analyses = self.db.analyses
            print("MongoDB connection successful")
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            print(f"Could not connect to MongoDB. Error: {e}")
            raise
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            raise

    def save_analysis(self, analysis_data):
        try:
            return self.analyses.insert_one(analysis_data)
        except Exception as e:
            print(f"Error saving analysis: {e}")
            raise

    def get_analysis(self, analysis_id):
        try:
            return self.analyses.find_one({"_id": analysis_id})
        except Exception as e:
            print(f"Error retrieving analysis: {e}")
            raise

    def get_user_analyses(self, user_id):
        return list(self.analyses.find({"user_id": user_id}))