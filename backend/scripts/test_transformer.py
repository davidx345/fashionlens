import os
import sys
from pathlib import Path

# Add the parent directory to system path
sys.path.append(str(Path(__file__).parent.parent.parent))

from backend.services.ai_service import AIAnalysisService

def test_transformer_analysis():
    """Test the transformer-based outfit analysis"""
    print("Testing Transformer-based Analysis")
    print("--------------------------------")
    
    try:
        # Initialize the AI service
        ai_service = AIAnalysisService()
        
        # Get test image path
        test_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_images')
        test_image = os.path.join(test_dir, 'test.jpg')
        
        if not os.path.exists(test_image):
            print(f"ERROR: No test image found at {test_image}")
            print("Please add a test image named 'test.jpg' to the backend/test_images directory")
            return False
            
        print(f"\nAnalyzing test image: {test_image}")
        
        # Perform analysis
        result = ai_service.analyze_outfit(test_image)
        
        print("\nAnalysis Results:")
        print("----------------")
        print(f"Style: {result['style']['description']} (Score: {result['style']['score']})")
        print(f"Color: {result['color']['description']} (Score: {result['color']['score']})")
        print(f"Occasion: {result['occasion']['description']} (Score: {result['occasion']['score']})")
        print(f"Overall Score: {result['overall_score']}")
        print("\nSuggestions:")
        for suggestion in result['suggestions']:
            print(f"- {suggestion}")
            
        return True
        
    except Exception as e:
        print(f"\nERROR: Analysis failed:")
        print(f"Details: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_transformer_analysis()
    if not success:
        import sys
        sys.exit(1)