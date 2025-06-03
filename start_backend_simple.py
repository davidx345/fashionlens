#!/usr/bin/env python3
import sys
import os
import subprocess

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(script_dir, 'backend')

# Change to backend directory
os.chdir(backend_dir)

print("Starting Fashion Lens Backend Server...")
print(f"Working directory: {os.getcwd()}")

try:
    # Start the Flask application
    subprocess.run([sys.executable, 'run.py'], check=True)
except KeyboardInterrupt:
    print("\nShutting down server...")
except Exception as e:
    print(f"Error starting server: {e}")
    sys.exit(1)
