from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
from routes.auth import auth_bp
from routes.analysis import analysis_bp
from routes.wardrobe import wardrobe_bp
from routes.recommendations import recommendations_bp
from routes.user import user_bp
from utils.db import initialize_db

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure app
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['MONGO_URI'] = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/fashion_analysis')
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', 'uploads')
app.config['GEMINI_API_KEY'] = os.environ.get('GEMINI_API_KEY')

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
initialize_db(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(analysis_bp, url_prefix='/api/analysis')
app.register_blueprint(wardrobe_bp, url_prefix='/api/wardrobe')
app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
app.register_blueprint(user_bp, url_prefix='/api/user')

# Serve uploaded files
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Root route
@app.route('/')
def index():
    return jsonify({
        'message': 'Fashion Analysis API',
        'status': 'running'
    })

# Health check endpoints
@app.route('/api/health/ping')
def health_ping():
    return jsonify({'status': 'ok', 'message': 'API is running'}), 200

@app.route('/api/health/db')
def health_db():
    try:
        from utils.db import get_db
        db = get_db()
        # Just perform a simple check to see if we can connect
        db.command('ping')
        return jsonify({'status': 'connected', 'message': 'Database connection successful'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
