import requests
import os

def test_analysis_workflow():
    """Test the complete analysis workflow"""
    base_url = "http://localhost:5000"
    
    print("Testing Analysis Workflow")
    print("-----------------------")
    
    # 1. Test health endpoint
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/api/health")
        print(f"Health check response: {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
    
    # 2. Test DB health
    print("\n2. Testing database health...")
    try:
        response = requests.get(f"{base_url}/api/db-health")
        print(f"DB health response: {response.json()}")
    except Exception as e:
        print(f"DB health check failed: {e}")
    
    # 3. Test image analysis
    print("\n3. Testing image analysis...")
    test_image_path = "backend/test_images/test.jpg"
    
    if not os.path.exists(test_image_path):
        print(f"Test image not found at: {test_image_path}")
        return
    
    try:
        with open(test_image_path, 'rb') as image:
            files = {'file': ('test.jpg', image, 'image/jpeg')}
            response = requests.post(f"{base_url}/api/analyze", files=files)
            
            print(f"Analysis response status: {response.status_code}")
            print(f"Analysis response: {response.json()}")
            
            if response.status_code == 200:
                analysis_id = response.json()['id']
                
                # 4. Test retrieval of analysis
                print("\n4. Testing analysis retrieval...")
                get_response = requests.get(f"{base_url}/api/analysis/{analysis_id}")
                print(f"Retrieval response: {get_response.json()}")
            
    except Exception as e:
        print(f"Analysis test failed: {e}")

if __name__ == "__main__":
    test_analysis_workflow()