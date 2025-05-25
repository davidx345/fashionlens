#!/usr/bin/env python
"""
Health check script for the Fashion Analysis application.
This script checks the status of both the backend and frontend components.
"""

import os
import sys
import requests
import subprocess
import platform

def check_backend_health():
    """Check if the backend server is running and accessible"""
    print("\n=== Checking Backend Health ===")
    
    try:
        response = requests.get("http://localhost:5000/", timeout=5)
        if response.status_code == 200:
            print("✅ Backend API is running")
            
            # Check MongoDB connection through backend
            try:
                db_check = requests.get("http://localhost:5000/api/health/db", timeout=5)
                if db_check.status_code == 200 and db_check.json().get('status') == 'connected':
                    print("✅ MongoDB connection successful")
                else:
                    print("❌ MongoDB connection failed through backend API")
                    print(f"   Response: {db_check.json()}")
            except Exception as db_err:
                print(f"❌ Failed to check MongoDB connection: {db_err}")
                
            return True
        else:
            print(f"❌ Backend API returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend API is not running or not accessible")
        return False
    except Exception as e:
        print(f"❌ Error checking backend health: {e}")
        return False

def check_frontend_health():
    """Check if the frontend development server is running"""
    print("\n=== Checking Frontend Health ===")
    
    try:
        response = requests.get("http://localhost:3000/", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend server is running")
            return True
        else:
            print(f"❌ Frontend server returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Frontend server is not running or not accessible")
        return False
    except Exception as e:
        print(f"❌ Error checking frontend health: {e}")
        return False

def check_mongodb_connection():
    """Check MongoDB connection using test script"""
    print("\n=== Checking MongoDB Connection ===")
    
    python_exe = sys.executable
    script_path = os.path.join("backend", "test_db_connection.py")
    
    try:
        result = subprocess.run(
            [python_exe, script_path], 
            capture_output=True,
            text=True,
            check=False
        )
        
        output = result.stdout
        
        if "Successfully connected" in output:
            print("✅ MongoDB connection successful")
            return True
        else:
            print("❌ MongoDB connection failed")
            print(output)
            return False
    except Exception as e:
        print(f"❌ Error checking MongoDB connection: {e}")
        return False

def check_environment_files():
    """Check if all required environment files exist"""
    print("\n=== Checking Environment Files ===")
    
    files_to_check = [
        ("backend/.env", "Backend environment file"),
        ("frontend/.env.local", "Frontend environment file"),
    ]
    
    all_found = True
    
    for file_path, description in files_to_check:
        if os.path.exists(file_path):
            print(f"✅ Found {description}: {file_path}")
        else:
            print(f"❌ Missing {description}: {file_path}")
            all_found = False
    
    return all_found

def main():
    """Main function to run health checks"""
    print("=== Fashion Analysis Application Health Check ===")
    
    checks = [
        {"name": "Environment Files", "func": check_environment_files},
        {"name": "MongoDB Connection", "func": check_mongodb_connection},
        {"name": "Backend API", "func": check_backend_health},
        {"name": "Frontend Server", "func": check_frontend_health},
    ]
    
    results = {}
    
    for check in checks:
        results[check["name"]] = check["func"]()
    
    print("\n=== Health Check Summary ===")
    all_passed = True
    for name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {name}")
        if not passed:
            all_passed = False
    
    print("\n=== Recommendations ===")
    if not results["Environment Files"]:
        print("- Create missing environment files from the example templates")
    
    if not results["MongoDB Connection"]:
        print("- Check your MongoDB Atlas credentials in backend/.env")
        print("- Ensure your IP is whitelisted in MongoDB Atlas")
    
    if not results["Backend API"]:
        print("- Start the backend server with: cd backend && python run.py")
    
    if not results["Frontend Server"]:
        print("- Start the frontend server with: cd frontend && npm run dev")
    
    if all_passed:
        print("All systems operational! 🚀")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
