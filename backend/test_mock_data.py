#!/usr/bin/env python3

import sys
import os
import json

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai.gemini_analyzer import GeminiAnalyzer

def test_mock_data_variability():
    print("Testing mock analysis data variability...")
    
    # Generate multiple analysis results
    results = []
    for i in range(5):
        result = GeminiAnalyzer._mock_analysis_results()
        results.append(result)
        print(f"\nAnalysis {i+1}:")
        print(f"Overall Score: {result['overallScore']}")
        print(f"Style: {result['style']}")
        print(f"Color Harmony: {result['colorHarmony']}")
        print(f"Fit: {result['fit']}")
        print(f"Occasions: {result['occasion']}")
        print(f"Body Shape: {result['bodyShape']}")
        print(f"Sustainability Score: {result['sustainability']['score']}")
    
    # Check if all results are different
    unique_results = []
    for result in results:
        # Convert to string for comparison (since dict comparison might be complex)
        result_str = json.dumps(result, sort_keys=True)
        if result_str not in unique_results:
            unique_results.append(result_str)
    
    print(f"\n--- Summary ---")
    print(f"Total analyses generated: {len(results)}")
    print(f"Unique analyses: {len(unique_results)}")
    print(f"Variability working: {'YES' if len(unique_results) > 1 else 'NO'}")
    
    if len(unique_results) <= 1:
        print("WARNING: All analyses are identical!")
        return False
    else:
        print("SUCCESS: Mock data is generating varied results!")
        return True

if __name__ == "__main__":
    test_mock_data_variability()
