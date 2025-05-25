#!/usr/bin/env python
"""
Initializes the directory structure required for the Fashion Analysis application.
This script ensures the upload folders and other necessary directories are created.
"""

import os
import sys

def create_directories():
    """Create required directories for the Fashion Analysis app"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Backend uploads directory
    backend_uploads = os.path.join(base_dir, 'backend', 'uploads')
    os.makedirs(backend_uploads, exist_ok=True)
    print(f"✓ Created backend uploads directory: {backend_uploads}")
    
    # Frontend public directory for images
    frontend_public_images = os.path.join(base_dir, 'frontend', 'public', 'images')
    os.makedirs(frontend_public_images, exist_ok=True)
    print(f"✓ Created frontend public images directory: {frontend_public_images}")
    
    # Sample avatars directory
    avatar_dir = os.path.join(base_dir, 'frontend', 'public', 'avatars')
    os.makedirs(avatar_dir, exist_ok=True)
    print(f"✓ Created avatars directory: {avatar_dir}")
    
    # Top-level uploads directory for shared access
    top_uploads = os.path.join(base_dir, 'uploads')
    os.makedirs(top_uploads, exist_ok=True)
    print(f"✓ Created top-level uploads directory: {top_uploads}")

if __name__ == "__main__":
    print("Initializing Fashion Analysis directory structure...")
    create_directories()
    print("Directory initialization complete!")
