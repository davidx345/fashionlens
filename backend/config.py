import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MongoDB settings
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
    MONGODB_DB = os.getenv('MONGODB_DB', 'fashionlens')
    
    # MongoDB connection timeout
    MONGODB_TIMEOUT = 5000  # 5 seconds timeout
    
    # App settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB max upload size