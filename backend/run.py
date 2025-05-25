# c:\Users\david\Documents\projects\fashion\backend\run.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from app import app # Imports the Flask app instance from app.py in the same directory

if __name__ == "__main__":
    # Read host, port, and debug settings from environment variables
    # with sensible defaults.
    host = os.environ.get("FLASK_RUN_HOST", "0.0.0.0")
    # Use PORT if FLASK_RUN_PORT is not set, for compatibility with some hosting platforms
    port = int(os.environ.get("FLASK_RUN_PORT", os.environ.get("PORT", 5000)))
    # FLASK_DEBUG is typically '1' for True or '0' for False in Flask's env vars
    # Or it can be 'True'/'False' strings.
    debug_str = os.environ.get("FLASK_DEBUG", "1") # Default to debug mode True
    debug = debug_str.lower() in ("true", "1", "t", "yes")

    print(f"Starting Flask app on {host}:{port} with debug mode {'on' if debug else 'off'}")
    app.run(host=host, port=port, debug=debug)
