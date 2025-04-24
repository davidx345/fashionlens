from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import sys
import pathlib
import logging
from pymongo.errors import ConnectionFailure

# Add backend directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from backend.config import Config
from backend.models.db import Database
from backend.services.vision_service import save_uploaded_file
from backend.services.ai_service import AIAnalysisService

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize services with error handling
try:
    db = Database()
    ai_service = AIAnalysisService()
except ConnectionFailure:
    print("Failed to connect to MongoDB. Ensure MongoDB is running.")
    sys.exit(1)
except Exception as e:
    print(f"Error initializing services: {e}")
    sys.exit(1)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"})

# Add a MongoDB health check endpoint
@app.route('/api/db-health', methods=['GET'])
def db_health_check():
    """Check MongoDB connection health"""
    try:
        # Ping the database
        db.client.admin.command('ping')
        return jsonify({"status": "healthy", "message": "MongoDB connection is active"})
    except Exception as e:
        return jsonify({"status": "unhealthy", "message": str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_outfit():
    """
    Endpoint to analyze an outfit image
    """
    try:
        logger.debug("Received analysis request")
        
        # Check if file exists in request
        if 'file' not in request.files:
            logger.error("No file in request")
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        logger.debug(f"Received file: {file.filename}")
        
        if file.filename == '':
            logger.error("Empty filename")
            return jsonify({"error": "No file selected"}), 400
        
        # Save the uploaded file
        file_path = save_uploaded_file(file)
        if not file_path:
            logger.error("Failed to save file")
            return jsonify({"error": "Invalid file format"}), 400
        
        logger.debug(f"File saved to: {file_path}")
        
        # Process the image with AI
        logger.debug("Starting AI analysis")
        analysis_result = ai_service.analyze_outfit(file_path)
        
        # If AI analysis failed
        if not analysis_result or "error" in analysis_result:
            logger.error(f"AI analysis failed: {analysis_result}")
            return jsonify({"error": "Failed to analyze image"}), 500
        
        logger.debug("AI analysis completed successfully")
        
        # Save analysis to database
        analysis_id = db.save_analysis({
            "file_path": file_path,
            "analysis": analysis_result,
            "created_at": datetime.utcnow()
        }).inserted_id
        
        logger.debug(f"Analysis saved with ID: {analysis_id}")
        
        # Return the analysis results
        return jsonify({
            "id": str(analysis_id),
            "analysis": analysis_result
        })
        
    except Exception as e:
        logger.error(f"Error in analyze_outfit: {e}", exc_info=True)
        return jsonify({"error": "Failed to analyze image"}), 500

@app.route('/api/analysis/<analysis_id>', methods=['GET'])
def get_analysis(analysis_id):
    """
    Endpoint to retrieve a saved analysis
    """
    from bson.objectid import ObjectId
    
    analysis = db.get_analysis(ObjectId(analysis_id))
    
    if not analysis:
        return jsonify({"error": "Analysis not found"}), 404
    
    return jsonify({
        "id": str(analysis["_id"]),
        "analysis": analysis["analysis"],
        "created_at": analysis["created_at"].isoformat()
    })

if __name__ == '__main__':
    # Make sure upload folder exists
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=5000)