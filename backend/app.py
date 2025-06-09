from flask import Flask, jsonify, send_from_directory, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from datetime import timedelta
from routes.auth import auth_bp
from routes.analysis import analysis_bp
from routes.wardrobe import wardrobe_bp
from routes.recommendations import recommendations_bp
from routes.user import user_bp
from routes.dashboard import dashboard_bp
from utils.db import initialize_db

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enhanced CORS configuration for better compatibility
CORS(
    app,
    origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "https://fashionlens.vercel.app", 
        "https://fashionlens-frontend-git-main-xstatic72s-projects.vercel.app", 
        "https://fashionlens-frontend-80hxu1e2n-xstatic72s-projects.vercel.app"
    ],
    methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=[
        "Content-Type", 
        "Authorization", 
        "X-Requested-With",
        "Accept",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers"
    ],
    supports_credentials=True,
    expose_headers=["Content-Length", "X-CSRF-Token"],
    max_age=86400  # Cache preflight for 24 hours
)

# Configure app
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['MONGO_URI'] = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/fashion_analysis')
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', 'uploads')
app.config['GEMINI_API_KEY'] = os.environ.get('GEMINI_API_KEY')

# JWT Configuration for persistent sessions
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

# Initialize JWT
jwt = JWTManager(app)

# Create blacklist set for token revocation
blacklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload['jti'] in blacklist

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'message': 'Token has expired'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'message': 'Invalid token'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'message': 'Authentication token required'}), 401

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
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

# Handle preflight requests for all routes
@app.before_request
def handle_preflight():
    from flask import request, make_response
    if request.method == "OPTIONS":
        # List of allowed origins
        allowed_origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://fashionlens.vercel.app",
            "https://fashionlens-frontend-git-main-xstatic72s-projects.vercel.app",
            "https://fashionlens-frontend-80hxu1e2n-xstatic72s-projects.vercel.app"
        ]
        
        # Get the origin from the request
        origin = request.headers.get('Origin')
        
        # Create a proper JSON response for preflight requests
        response = make_response(jsonify({'status': 'preflight_ok'}))
        
        # Only set the origin if it's in our allowed list
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
        else:
            # Fallback to first allowed origin for development
            response.headers['Access-Control-Allow-Origin'] = allowed_origins[0]
            
        response.headers['Access-Control-Allow-Headers'] = "Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers"
        response.headers['Access-Control-Allow-Methods'] = "GET,POST,PUT,DELETE,PATCH,OPTIONS"
        response.headers['Access-Control-Allow-Credentials'] = "true"
        response.headers['Access-Control-Max-Age'] = "86400"
        # Explicitly set content type to application/json
        response.headers['Content-Type'] = 'application/json'
        return response

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
