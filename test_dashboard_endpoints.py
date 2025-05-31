#!/usr/bin/env python
"""Test dashboard endpoints"""
import requests
import json

# Test dashboard endpoints
BASE_URL = "http://localhost:5000"

def test_dashboard_endpoints():
    """Test all dashboard endpoints without authentication first"""
    
    print("Testing Dashboard Endpoints...")
    print("=" * 50)
    
    # Test health endpoint first
    try:
        response = requests.get(f"{BASE_URL}/api/health/ping")
        print(f"Health Check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Server not running: {e}")
        return
    
    # Dashboard endpoints (these will likely return 401 without auth)
    endpoints = [
        "/api/dashboard/analytics",
        "/api/dashboard/recent-activity", 
        "/api/dashboard/style-trends"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}")
            print(f"{endpoint}: {response.status_code}")
            if response.status_code != 401:  # Print response if not auth error
                print(f"  Response: {response.text[:100]}...")
        except Exception as e:
            print(f"{endpoint}: Error - {e}")
    
    print("\nNote: 401 errors are expected without authentication token")
    print("Test completed!")

if __name__ == "__main__":
    test_dashboard_endpoints()
