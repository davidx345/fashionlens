#!/usr/bin/env python3
"""
Test script to verify that the analysis endpoint returns varied results
instead of identical mock data.
"""

import requests
import json
import os
from pathlib import Path

def test_analysis_variability():
    # Create a simple test image file (1x1 pixel PNG)
    test_image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82'
    
    # Save test image
    test_image_path = 'test_outfit.png'
    with open(test_image_path, 'wb') as f:
        f.write(test_image_data)
    
    try:
        print("Testing analysis variability...")
        
        # Make multiple requests to the analysis endpoint
        results = []
        for i in range(3):
            print(f"\nMaking request {i+1}...")
            
            with open(test_image_path, 'rb') as f:
                files = {'images': ('test_outfit.png', f, 'image/png')}
                response = requests.post('http://localhost:5000/api/analysis/upload', files=files)
            
            if response.status_code == 200:
                data = response.json()
                results.append(data['results'])
                print(f"✓ Request {i+1} successful")
                print(f"  Overall Score: {data['results']['overallScore']}")
                print(f"  Style: {data['results']['style']}")
                print(f"  Color Harmony: {data['results']['colorHarmony']}")
                print(f"  Sustainability Score: {data['results']['sustainability']['score']}")
            else:
                print(f"✗ Request {i+1} failed: {response.status_code} - {response.text}")
        
        # Compare results
        if len(results) >= 2:
            print(f"\n{'='*50}")
            print("VARIABILITY TEST RESULTS:")
            print(f"{'='*50}")
            
            # Check if any results are different
            all_same = True
            for i in range(1, len(results)):
                if results[i] != results[0]:
                    all_same = False
                    break
            
            if all_same:
                print("❌ ISSUE FOUND: All analysis results are identical!")
                print("This confirms the original problem - mock data is not varying.")
            else:
                print("✅ SUCCESS: Analysis results are varied!")
                print("The mock data generation is working correctly.")
            
            # Show comparison
            print(f"\nDetailed comparison:")
            for i, result in enumerate(results):
                print(f"\nResult {i+1}:")
                print(f"  Overall Score: {result['overallScore']}")
                print(f"  Style: {result['style']}")
                print(f"  Color Harmony: {result['colorHarmony']}")
                print(f"  Body Shape: {result['bodyShape']}")
                print(f"  Sustainability: {result['sustainability']['score']}")
                print(f"  Occasions: {result['occasion']}")
        
    finally:
        # Clean up test file
        if os.path.exists(test_image_path):
            os.remove(test_image_path)

if __name__ == "__main__":
    test_analysis_variability()
