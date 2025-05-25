import os
import base64
import json
import requests
from flask import current_app
from PIL import Image
import io

class GeminiAnalyzer:
    """Class for analyzing outfit images using Google's Gemini API"""
    
    @staticmethod
    def analyze_outfit(image_paths):
        """Analyze outfit images using Gemini API"""
        try:
            api_key = current_app.config.get('GEMINI_API_KEY')
            if not api_key:
                print("Gemini API key not found. Using mock data.")
                return GeminiAnalyzer._mock_analysis_results()
            
            # Process images
            image_parts = []
            for image_path in image_paths:
                try:
                    # Resize image to reduce payload size
                    with Image.open(image_path) as img:
                        img = img.resize((512, 512), Image.LANCZOS)
                        buffered = io.BytesIO()
                        img.save(buffered, format="JPEG", quality=85)
                        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
                        
                    image_parts.append({
                        "inlineData": {
                            "mimeType": "image/jpeg",
                            "data": img_str
                        }
                    })
                except Exception as e:
                    print(f"Error processing image {image_path}: {e}")
                    continue
            
            if not image_parts:
                return GeminiAnalyzer._mock_analysis_results()
            
            # Prepare prompt
            prompt = """
            You are a fashion analysis AI. Analyze this outfit image and provide detailed feedback in JSON format.
            Include the following information:
            - overallScore: A score from 1-10 rating the outfit's overall appeal
            - style: The style category (e.g., Casual, Formal, Business Casual, Smart Casual, etc.)
            - colorHarmony: A score from 1-10 rating the color coordination
            - fit: A score from 1-10 rating how well the clothes fit
            - occasion: An array of suitable occasions for this outfit
            - bodyShape: The body shape this outfit works best for
            - fabrics: An array of detected fabric types
            - brands: An array of detected or likely brands
            - sustainability: A score from 1-10 rating the sustainability
            - recommendations: An array of 3-5 specific recommendations to improve the outfit
            
            Return ONLY the JSON object with no additional text.
            """
            
            # Prepare request to Gemini API
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key={api_key}"
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt},
                            *image_parts
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.4,
                    "topK": 32,
                    "topP": 1,
                    "maxOutputTokens": 4096
                }
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # Make request to Gemini API
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code != 200:
                print(f"Error from Gemini API: {response.status_code} - {response.text}")
                return GeminiAnalyzer._mock_analysis_results()
            
            # Parse response
            response_data = response.json()
            
            if 'candidates' not in response_data or not response_data['candidates']:
                print("No candidates in Gemini API response")
                return GeminiAnalyzer._mock_analysis_results()
            
            text_content = response_data['candidates'][0]['content']['parts'][0]['text']
            
            # Extract JSON from text (in case there's any extra text)
            try:
                # Find JSON object in text
                json_start = text_content.find('{')
                json_end = text_content.rfind('}') + 1
                
                if json_start >= 0 and json_end > json_start:
                    json_str = text_content[json_start:json_end]
                    analysis_results = json.loads(json_str)
                else:
                    # Try to parse the whole text as JSON
                    analysis_results = json.loads(text_content)
                
                # Ensure all required fields are present
                required_fields = [
                    'overallScore', 'style', 'colorHarmony', 'fit', 'occasion',
                    'bodyShape', 'fabrics', 'brands', 'sustainability', 'recommendations'
                ]
                
                for field in required_fields:
                    if field not in analysis_results:
                        if field in ['occasion', 'fabrics', 'brands', 'recommendations']:
                            analysis_results[field] = []
                        else:
                            analysis_results[field] = "Unknown"
                
                return analysis_results
                
            except json.JSONDecodeError as e:
                print(f"Error parsing Gemini API response as JSON: {e}")
                print(f"Response text: {text_content}")
                return GeminiAnalyzer._mock_analysis_results()
                
        except Exception as e:
            print(f"Error analyzing outfit with Gemini API: {e}")
            return GeminiAnalyzer._mock_analysis_results()
    
    @staticmethod
    def _mock_analysis_results():
        """Return mock analysis results for development"""
        return {
            'overallScore': 8.7,
            'style': 'Smart Casual',
            'colorHarmony': 9.2,
            'fit': 8.5,
            'occasion': ['Office', 'Casual Dinner', 'Weekend Outing'],
            'bodyShape': 'Rectangle',
            'fabrics': ['Cotton', 'Denim', 'Polyester'],
            'brands': ['Unidentified', 'Likely H&M', 'Zara'],
            'sustainability': 7.4,
            'recommendations': [
                "Consider adding a statement accessory to elevate the look.",
                "The color palette works well together, but could benefit from a pop of color.",
                "The fit is good, but the shirt could be slightly more tailored.",
                "This outfit is versatile and appropriate for multiple casual settings."
            ]
        }
