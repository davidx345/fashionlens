import os
import sys
from google.cloud import vision

# Add parent directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(parent_dir)

from backend.config import Config

def test_vision_api():
    """Test Google Cloud Vision API connection and credentials"""
    try:
        # Set credentials
        credentials_path = Config.GOOGLE_CREDENTIALS_PATH
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
        
        print(f"Testing Vision API configuration:")
        print(f"--------------------------------")
        print(f"Credentials path: {credentials_path}")
        
        if not os.path.exists(credentials_path):
            print(f"ERROR: Credentials file not found!")
            return False
            
        # Create client
        client = vision.ImageAnnotatorClient()
        
        # Create test_images directory if it doesn't exist
        test_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_images')
        if not os.path.exists(test_dir):
            os.makedirs(test_dir)
            print(f"Created test images directory at: {test_dir}")
        
        # Check for test image
        test_image = os.path.join(test_dir, 'test.jpg')
        if not os.path.exists(test_image):
            print(f"ERROR: No test image found at {test_image}")
            print("Please add a test image named 'test.jpg' to the backend/test_images directory")
            return False
            
        print(f"\nAnalyzing test image: {test_image}")
        
        # Read file
        with open(test_image, 'rb') as image_file:
            content = image_file.read()
        
        image = vision.Image(content=content)
        
        # Perform label detection
        response = client.label_detection(image=image)
        labels = response.label_annotations
        
        print("\nDetected labels:")
        for label in labels:
            print(f"- {label.description} ({label.score:.2f})")
        
        return True
    except Exception as e:
        print(f"\nERROR: Vision API Test Failed:")
        print(f"Details: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_vision_api()
    if not success:
        sys.exit(1)