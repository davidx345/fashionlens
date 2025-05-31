import json
import requests
import time

def test_backend_directly():
    """Test if backend is responding and generating varied mock data"""
    try:
        # Try to import and test the mock function directly
        import sys
        import os
        
        # Add backend to path
        backend_path = os.path.join(os.path.dirname(__file__), 'backend')
        sys.path.insert(0, backend_path)
        
        from ai.gemini_analyzer import GeminiAnalyzer
        
        print("Testing mock data generation directly...")
        results = []
        
        for i in range(5):
            result = GeminiAnalyzer._mock_analysis_results()
            results.append(result)
            print(f"\nTest {i+1}:")
            print(f"  Overall Score: {result['overallScore']}")
            print(f"  Style: {result['style']}")
            print(f"  Color Harmony: {result['colorHarmony']}")
            print(f"  Body Shape: {result['bodyShape']}")
            print(f"  Sustainability Score: {result['sustainability']['score']}")
        
        # Check if results are varied
        all_same = True
        for i in range(1, len(results)):
            if results[i] != results[0]:
                all_same = False
                break
        
        print(f"\n{'='*50}")
        if all_same:
            print("❌ PROBLEM: All mock results are identical!")
        else:
            print("✅ SUCCESS: Mock results are varied!")
        print(f"{'='*50}")
        
        return not all_same
        
    except Exception as e:
        print(f"Error testing mock data: {e}")
        return False

if __name__ == "__main__":
    test_backend_directly()
