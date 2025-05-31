#!/usr/bin/env python3
"""
Simple test to run Flask app and check dashboard endpoints
"""

import os
import sys
import requests
import time
import subprocess
import threading
from datetime import datetime

def start_flask_server():
    """Start the Flask server in a separate process"""
    try:
        backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
        os.chdir(backend_dir)
        
        # Start Flask app
        process = subprocess.Popen([sys.executable, 'app.py'], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE)
        return process
    except Exception as e:
        print(f"Error starting Flask server: {e}")
        return None

def test_dashboard_endpoints():
    """Test the dashboard endpoints"""
    print("=== TESTING DASHBOARD ENDPOINTS ===\n")
    
    base_url = "http://localhost:5000"
    
    # First, let's try to register/login to get a valid token
    print("1. Testing user registration/login...")
    
    # Test user data
    test_user = {
        "email": "test@example.com",
        "password": "testpassword123",
        "firstName": "Test",
        "lastName": "User"
    }
    
    try:
        # Try to register
        register_response = requests.post(f"{base_url}/api/auth/register", 
                                        json=test_user, 
                                        timeout=5)
        
        if register_response.status_code in [200, 201]:
            print("✅ Registration successful")
            token = register_response.json().get('access_token')
        else:
            print("Registration failed, trying login...")
            login_response = requests.post(f"{base_url}/api/auth/login", 
                                         json={
                                             "email": test_user["email"],
                                             "password": test_user["password"]
                                         }, 
                                         timeout=5)
            
            if login_response.status_code == 200:
                print("✅ Login successful")
                token = login_response.json().get('access_token')
            else:
                print(f"❌ Login failed: {login_response.status_code}")
                print(f"Response: {login_response.text}")
                return
    
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        return
    
    if not token:
        print("❌ No access token received")
        return
    
    print(f"🔑 Got access token: {token[:20]}...")
    
    # Test dashboard endpoints
    headers = {"Authorization": f"Bearer {token}"}
    
    endpoints = [
        "/api/dashboard/analytics",
        "/api/dashboard/recent-activity", 
        "/api/dashboard/style-trends"
    ]
    
    print("\n2. Testing dashboard endpoints...")
    
    for endpoint in endpoints:
        try:
            print(f"\nTesting {endpoint}...")
            response = requests.get(f"{base_url}{endpoint}", 
                                  headers=headers, 
                                  timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {endpoint} - Success")
                print(f"   Data: {data}")
            else:
                print(f"❌ {endpoint} - Failed: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ {endpoint} - Connection error: {e}")

def main():
    """Main function to run the test"""
    
    print(f"Starting dashboard endpoint test at {datetime.now()}")
    
    # Start Flask server
    print("Starting Flask server...")
    server_process = start_flask_server()
    
    if not server_process:
        print("Failed to start Flask server")
        return
    
    # Wait for server to start
    print("Waiting for server to start...")
    time.sleep(5)
    
    try:
        # Test if server is running
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running")
            
            # Run the dashboard tests
            test_dashboard_endpoints()
        else:
            print("❌ Server not responding properly")
            
    except requests.exceptions.RequestException:
        print("❌ Server not reachable")
    
    finally:
        # Clean up
        print("\nCleaning up...")
        if server_process:
            server_process.terminate()
            server_process.wait()
        print("Done.")

if __name__ == "__main__":
    main()
