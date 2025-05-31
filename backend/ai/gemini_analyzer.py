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
            - colorHarmony: A score from 1-100 rating the color coordination
            - fit: A score from 1-100 rating how well the clothes fit
            - occasion: An array of suitable occasions for this outfit
            - bodyShape: The body shape this outfit works best for
            - fabrics: An array of detected fabric types
            - brands: An array of detected or likely brands
            - sustainability: An object with "score" (1-100) and "feedback" (string explanation)
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
        import random
        
        # Generate varied mock data for each analysis
        styles = ['Smart Casual', 'Business Casual', 'Formal', 'Casual', 'Sporty', 'Bohemian', 'Minimalist', 'Trendy']
        occasions_list = [
            ['Office', 'Business Meeting', 'Professional Event'],
            ['Casual Dinner', 'Date Night', 'Social Gathering'],
            ['Weekend Outing', 'Shopping', 'Brunch'],
            ['Formal Event', 'Wedding Guest', 'Evening Party'],
            ['Work from Home', 'Errands', 'Relaxed Day'],
            ['Gym', 'Sports Activity', 'Active Lifestyle'],
            ['Beach', 'Vacation', 'Summer Day'],
            ['Concert', 'Night Out', 'Entertainment']
        ]
        body_shapes = ['Rectangle', 'Pear', 'Apple', 'Hourglass', 'Inverted Triangle', 'Athletic']
        fabric_options = [
            ['Cotton', 'Denim', 'Polyester'],
            ['Silk', 'Wool', 'Cashmere'],
            ['Linen', 'Rayon', 'Spandex'],
            ['Leather', 'Suede', 'Canvas'],
            ['Chiffon', 'Satin', 'Velvet']
        ]
        brand_options = [
            ['Unidentified', 'Likely H&M', 'Zara'],
            ['Nike', 'Adidas', 'Under Armour'],
            ['Gap', 'Uniqlo', 'J.Crew'],
            ['Designer Brand', 'Luxury Label', 'High-End'],
            ['Vintage', 'Thrift Find', 'Local Brand']
        ]
        
        recommendation_sets = [
            [
                "Consider adding a statement accessory to elevate the look.",
                "The color palette works well together, but could benefit from a pop of color.",
                "The fit is good, but the shirt could be slightly more tailored.",
                "This outfit is versatile and appropriate for multiple casual settings."
            ],
            [
                "The overall composition is strong, but try experimenting with different textures.",
                "Consider swapping the shoes for something with more visual interest.",
                "Adding a belt could help define the silhouette better.",
                "This look could transition well from day to evening with minor adjustments."
            ],
            [
                "The proportions work well for your body type.",
                "Try incorporating more seasonal colors for better relevance.",
                "The layering technique is effective but could be refined.",
                "Consider the dress code requirements for your intended occasions."
            ],
            [
                "Bold color choices show confidence in personal style.",
                "The fit could be improved with some minor alterations.",
                "This outfit demonstrates good understanding of current trends.",
                "Adding complementary accessories would complete the look."
            ]
        ]
        
        sustainability_feedbacks = [
            'This outfit has moderate sustainability with mix of natural and synthetic materials.',
            'High sustainability score due to natural fibers and likely longevity of pieces.',
            'Lower sustainability due to fast fashion items, consider investing in quality pieces.',
            'Good balance of trendy and timeless pieces for sustainable wardrobe building.',
            'Excellent use of versatile pieces that can be styled multiple ways.'
        ]
        
        return {
            'overallScore': round(random.uniform(6.5, 9.5), 1),
            'style': random.choice(styles),
            'colorHarmony': random.randint(70, 95),
            'fit': random.randint(75, 95),
            'occasion': random.choice(occasions_list),
            'bodyShape': random.choice(body_shapes),
            'fabrics': random.choice(fabric_options),
            'brands': random.choice(brand_options),
            'sustainability': {
                'score': random.randint(60, 90),
                'feedback': random.choice(sustainability_feedbacks)
            },
            'recommendations': random.choice(recommendation_sets)
        }
