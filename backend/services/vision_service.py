import os
import uuid
from werkzeug.utils import secure_filename
from backend.config import Config

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def save_uploaded_file(file):
    """
    Save an uploaded file to the uploads directory
    """
    if not os.path.exists(Config.UPLOAD_FOLDER):
        os.makedirs(Config.UPLOAD_FOLDER)
        
    if file and allowed_file(file.filename):
        # Generate unique filename to prevent collisions
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(Config.UPLOAD_FOLDER, unique_filename)
        file.save(file_path)
        return file_path
    return None