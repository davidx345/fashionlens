#!/usr/bin/env python3
"""
Quick backend startup script for FashionLens
"""
import os
import sys
import subprocess

def start_backend():
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
    os.chdir(backend_dir)
    
    print("Starting FashionLens Backend...")
    print(f"Working directory: {backend_dir}")
    
    try:
        # Start the Flask application
        subprocess.run([sys.executable, 'run.py'], check=True)
    except KeyboardInterrupt:
        print("\nBackend stopped by user")
    except Exception as e:
        print(f"Error starting backend: {e}")

if __name__ == "__main__":
    start_backend()
