from flask import Flask, jsonify, make_response, send_from_directory, request
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

# Define allowed frontend origins
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://fashionlens.vercel.app",
    "https://fashionlens-frontend-git-main-xstatic72s-projects.vercel.app",
    "https://fashionlens-frontend-80hxu1e2n-xstatic72s-projects.vercel.app"
]

# Load additional origins from .env
if os.environ.get('ADDITIONAL_ORIGINS'):
    ALLOWED_ORIGINS += [o.strip() for o in os.environ.get('ADDITIONAL_ORIGINS').split(',')]

print(f"🚀 Allowed Origins: {ALLOWED_ORIGINS}")

print(f"🚀 CORS Allowed Origins: {ALLOWED_ORIGINS}")

# Remove Flask-CORS automatic handling - we'll handle it manually
# Apply CORS with dynamic origin handling
CORS(app, 
     resources={r"/api/*": {"origins": [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://fashionlens.vercel.app",
        "https://fashionlens-frontend-git-main-xstatic72s-projects.vercel.app",
        "https://fashionlens-frontend-80hxu1e2n-xstatic72s-projects.vercel.app"
     ]}}, 
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Content-Type", "Authorization"])


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

# Production-ready CORS preflight handler
@app.before_request
def handle_preflight():
    """Enhanced CORS preflight handler for production deployment"""
    if request.method == 'OPTIONS':
        origin = request.headers.get('Origin')
        
        # Debug logging for Railway deployment
        print(f"🔍 OPTIONS request from origin: {origin}")
        print(f"📋 Allowed origins: {ALLOWED_ORIGINS}")
        
        # Check if origin is allowed
        if origin and origin in ALLOWED_ORIGINS:
            response = make_response('', 200)
            

            response.headers['Access-Control-Allow-Origin'] = origin
                
            response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Requested-With,Accept,Origin'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Max-Age'] = '3600'
            
            # Explicitly set content type for Railway
            response.headers['Content-Type'] = 'application/json'
            
            print(f"✅ CORS preflight approved for origin: {origin}")
            return response
        else:
            print(f"❌ CORS preflight rejected for origin: {origin}")
            response = jsonify({'error': 'CORS origin not allowed'})
            response.status_code = 403
            return response

@app.after_request
def after_request(response):
    """Enhanced after request handler for consistent CORS headers"""
    origin = request.headers.get('Origin')
    
    if origin and origin in ALLOWED_ORIGINS:
        if origin in ALLOWED_ORIGINS:
            response.headers['Access-Control-Allow-Origin'] = origin
            
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Requested-With,Accept,Origin'
        
    return response


# Initialize JWT
jwt = JWTManager(app)
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

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize DB
initialize_db(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(analysis_bp, url_prefix='/api/analysis')
app.register_blueprint(wardrobe_bp, url_prefix='/api/wardrobe')
app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

# Static uploads
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# API root
@app.route('/')
def index():
    return jsonify({'message': 'Fashion Analysis API', 'status': 'running'})

# Health check routes
@app.route('/api/health/ping')
def health_ping():
    return jsonify({'status': 'ok', 'message': 'API is running'})

@app.route('/api/health/cors', methods=['GET', 'POST', 'OPTIONS'])
def health_cors():
    origin = request.headers.get('Origin')
    return jsonify({
        'status': 'ok',
        'message': 'CORS is working',
        'origin': origin,
        'method': request.method
    })

@app.route('/api/health/db')
def health_db():
    try:
        from utils.db import get_db
        db = get_db()
        db.command('ping')
        return jsonify({'status': 'connected', 'message': 'Database connection successful'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Server error'}), 500

# Run the app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
