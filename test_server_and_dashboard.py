import subprocess
import time
import requests
import sys
import os

def start_and_test():
    # Start the server
    print("Starting Flask server...")
    backend_dir = r"C:\Users\xstat\OneDrive\Documents\Dev\webDev\fashionlens\backend"
    os.chdir(backend_dir)
    
    server_process = subprocess.Popen([sys.executable, "run.py"], 
                                     stdout=subprocess.PIPE, 
                                     stderr=subprocess.PIPE)
    
    # Wait for server to start
    print("Waiting for server to start...")
    time.sleep(3)
    
    try:
        # Test health endpoint
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running!")
            
            # Test login to get token
            login_data = {
                "email": "xstati72@gmail.com",
                "password": "testpass123"  # Use actual password
            }
            
            login_response = requests.post("http://localhost:5000/api/auth/login", 
                                         json=login_data, timeout=5)
            
            if login_response.status_code == 200:
                token = login_response.json().get('access_token')
                print(f"✅ Login successful, got token: {token[:20]}...")
                
                # Test dashboard endpoints
                headers = {"Authorization": f"Bearer {token}"}
                
                # Test analytics
                analytics_response = requests.get("http://localhost:5000/api/dashboard/analytics", 
                                                headers=headers, timeout=5)
                
                if analytics_response.status_code == 200:
                    data = analytics_response.json()
                    print("✅ Dashboard analytics working!")
                    print(f"   Total Analyses: {data.get('totalAnalyses', {}).get('value', 'N/A')}")
                    print(f"   Wardrobe Items: {data.get('wardrobeItems', {}).get('value', 'N/A')}")
                    print(f"   Style Score: {data.get('styleScoreAverage', {}).get('value', 'N/A')}")
                else:
                    print(f"❌ Dashboard analytics failed: {analytics_response.status_code}")
                    print(f"   Response: {analytics_response.text}")
            else:
                print(f"❌ Login failed: {login_response.status_code}")
                print(f"   Response: {login_response.text}")
        else:
            print(f"❌ Server not responding: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
    
    finally:
        # Clean up
        print("Stopping server...")
        server_process.terminate()
        server_process.wait()

if __name__ == "__main__":
    start_and_test()
