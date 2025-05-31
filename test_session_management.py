#!/usr/bin/env python
"""Test session management with JWT tokens"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_session_management():
    """Test the JWT-based session management system"""
    print("Testing Session Management System...")
    print("=" * 50)
    
    # Test 1: Health check
    try:
        response = requests.get(f"{BASE_URL}/api/health/ping")
        print(f"✓ Health Check: {response.status_code}")
    except Exception as e:
        print(f"✗ Server not running: {e}")
        return
    
    # Test 2: Try to access protected endpoint without auth
    try:
        response = requests.get(f"{BASE_URL}/api/dashboard/analytics")
        if response.status_code == 401:
            print("✓ Protected endpoint correctly returns 401 without auth")
        else:
            print(f"✗ Unexpected response: {response.status_code}")
    except Exception as e:
        print(f"✗ Error testing protected endpoint: {e}")
    
    # Test 3: Register a test user
    test_user = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=test_user)
        if response.status_code == 201:
            data = response.json()
            access_token = data.get('access_token')
            refresh_token = data.get('refresh_token')
            print(f"✓ User registration successful")
            print(f"  Access token: {access_token[:20]}...")
            print(f"  Refresh token: {refresh_token[:20]}...")
            
            # Test 4: Access protected endpoint with token
            headers = {"Authorization": f"Bearer {access_token}"}
            response = requests.get(f"{BASE_URL}/api/dashboard/analytics", headers=headers)
            if response.status_code == 200:
                print("✓ Protected endpoint accessible with valid token")
            else:
                print(f"✗ Protected endpoint failed: {response.status_code}")
            
            # Test 5: Check session endpoint
            response = requests.get(f"{BASE_URL}/api/auth/session-check", headers=headers)
            if response.status_code == 200:
                print("✓ Session check successful")
            else:
                print(f"✗ Session check failed: {response.status_code}")
            
            # Test 6: Test refresh token
            refresh_headers = {"Authorization": f"Bearer {refresh_token}"}
            response = requests.post(f"{BASE_URL}/api/auth/refresh", headers=refresh_headers)
            if response.status_code == 200:
                new_access_token = response.json().get('access_token')
                print(f"✓ Token refresh successful")
                print(f"  New access token: {new_access_token[:20]}...")
            else:
                print(f"✗ Token refresh failed: {response.status_code}")
            
            # Test 7: Logout
            response = requests.post(f"{BASE_URL}/api/auth/logout", headers=headers)
            if response.status_code == 200:
                print("✓ Logout successful")
            else:
                print(f"✗ Logout failed: {response.status_code}")
            
        elif response.status_code == 409:
            print("ℹ User already exists, trying login instead...")
            
            # Try login instead
            login_data = {"email": test_user["email"], "password": test_user["password"]}
            response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                access_token = data.get('access_token')
                print("✓ Login successful")
                
                # Test protected endpoint
                headers = {"Authorization": f"Bearer {access_token}"}
                response = requests.get(f"{BASE_URL}/api/dashboard/analytics", headers=headers)
                if response.status_code == 200:
                    print("✓ Protected endpoint accessible after login")
                else:
                    print(f"✗ Protected endpoint failed after login: {response.status_code}")
            else:
                print(f"✗ Login failed: {response.status_code}")
        else:
            print(f"✗ Registration failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"✗ Error during registration/login: {e}")
    
    print("\nSession management test completed!")

if __name__ == "__main__":
    test_session_management()
