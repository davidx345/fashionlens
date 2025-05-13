import google.generativeai as genai
import os
from dotenv import load_dotenv
import base64
import json
import logging
from PIL import Image

load_dotenv()

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        """Initialize Gemini service with API key"""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("No GEMINI_API_KEY found in environment variables.")
            raise ValueError("GEMINI_API_KEY is required")
            
        # Configure Gemini API
        genai.configure(api_key=api_key)
        logger.info("Gemini service initialized")
    
    def analyze_outfit(self, image_path):
        """Analyze outfit using Gemini Vision API"""
        try:
            # Ensure the image exists
            if not os.path.exists(image_path):
                logger.error(f"Image not found: {image_path}")
                return {"error": "Image file not found"}
                
            # Convert image to bytes
            with open(image_path, "rb") as f:
                image_bytes = f.read()
            
            # Define the prompt for outfit analysis
            prompt = """
            Analyze this outfit and provide detailed feedback:
            1. Overall rating (1-10)
            2. Style classification (casual, formal, business casual, sporty, streetwear, etc.)
            3. Color harmony assessment
            4. Fit analysis
            5. Suggested improvements
            6. Best occasions for this outfit
            
            Format the response as a JSON object with the following structure:
            {
              "overall_score": <number between 1 and 10>,
              "style": {"description": "<style type>", "score": <number between 1 and 10>},
              "color": {"description": "<color assessment>", "score": <number between 1 and 10>},
              "fit": {"description": "<fit assessment>", "score": <number between 1 and 10>},
              "suggestions": ["<suggestion 1>", "<suggestion 2>", ...],
              "occasions": ["<occasion 1>", "<occasion 2>", ...],
              "tags": ["<tag1>", "<tag2>", ...]
            }
            """
            
            # Select Gemini Pro Vision model
            model = genai.GenerativeModel('gemini-1.5-pro-vision')
            
            # Generate response
            response = model.generate_content([prompt, image_bytes])
            
            # Extract JSON from the response
            result_text = response.text
            
            # Try to parse JSON from the response
            try:
                # Find JSON in the response if it's wrapped in markdown code blocks
                if "```json" in result_text:
                    json_content = result_text.split("```json")[1].split("```")[0].strip()
                    result_data = json.loads(json_content)
                else:
                    # Direct JSON parsing
                    result_data = json.loads(result_text)
                    
                # Ensure we have all required fields
                required_fields = ["overall_score", "style", "color", "suggestions"]
                for field in required_fields:
                    if field not in result_data:
                        logger.warning(f"Missing required field in Gemini response: {field}")
                        result_data[field] = {"description": "Not available", "score": 5} if field in ["style", "color"] else []
                
                return result_data
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON from Gemini response: {e}")
                # If JSON parsing fails, structure response manually
                return {
                    "overall_score": 5,  # default middle rating
                    "style": {"description": "Unknown", "score": 5},
                    "color": {"description": "Unknown", "score": 5},
                    "fit": {"description": "Unknown", "score": 5},
                    "suggestions": ["Analysis unavailable"],
                    "occasions": ["casual"],
                    "tags": ["outfit"],
                    "raw_response": result_text
                }
                
        except Exception as e:
            logger.error(f"Error analyzing outfit with Gemini: {str(e)}")
            return {
                "error": str(e),
                "overall_score": 5,
                "style": {"description": "Error in analysis", "score": 0},
                "color": {"description": "Error in analysis", "score": 0},
                "suggestions": ["Error processing image"],
                "tags": ["error", "outfit"]
            }
    
    def get_outfit_recommendations(self, wardrobe_items, occasion=None, season=None):
        """Generate outfit recommendations based on user's wardrobe"""
        try:
            # Prepare wardrobe data - limit to essential information
            wardrobe_data = []
            for item in wardrobe_items:
                wardrobe_data.append({
                    "name": item["name"],
                    "category": item["category"],
                    "properties": item.get("properties", {})
                })
            
            # Create context for the model
            context = {
                "wardrobe": wardrobe_data,
                "occasion": occasion,
                "season": season
            }
            
            # Create prompt
            prompt = f"""
            Based on this wardrobe: {json.dumps(wardrobe_data)},
            
            Generate 3 outfit combinations that would look good together.
            {"Consider that it's for: " + occasion if occasion else ""}
            {"Consider that it's for the " + season + " season" if season else ""}
            
            For each outfit:
            1. List the specific items to wear
            2. Explain why they work well together
            3. Suggest any small additions that would enhance the outfit
            
            Format the response as a JSON array of outfit objects with this structure:
            [
              {{
                "items": ["<item name 1>", "<item name 2>", ...],
                "explanation": "<why these items work together>",
                "suggestions": ["<suggestion 1>", "<suggestion 2>", ...]
              }},
              ...
            ]
            """
            
            # Use Gemini Pro for text-based recommendations
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(prompt)
            
            # Extract and parse JSON
            result_text = response.text
            
            # Try to parse JSON from the response
            try:
                # Find JSON in the response if it's wrapped in markdown code blocks
                if "```json" in result_text:
                    json_content = result_text.split("```json")[1].split("```")[0].strip()
                    recommendations = json.loads(json_content)
                else:
                    # Direct JSON parsing
                    recommendations = json.loads(result_text)
                    
                return recommendations
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON from Gemini recommendations: {e}")
                # Return structured error response
                return [{
                    "items": [],
                    "explanation": "Could not generate recommendations",
                    "suggestions": ["Please try again later"],
                    "raw_response": result_text
                }]
                
        except Exception as e:
            logger.error(f"Error generating recommendations with Gemini: {str(e)}")
            return [{
                "error": str(e),
                "items": [],
                "explanation": "Error occurred during recommendation"
            }]

    def detect_body_shape(self, image_path):
        """Detect body shape and provide style advice"""
        try:
            # Ensure the image exists
            if not os.path.exists(image_path):
                logger.error(f"Image not found: {image_path}")
                return {"error": "Image file not found"}
                
            # Convert image to bytes
            with open(image_path, "rb") as f:
                image_bytes = f.read()
            
            prompt = """
            Analyze this person's body shape and provide style advice:
            1. Identify the body shape (hourglass, pear, rectangle, apple, inverted triangle)
            2. List clothing styles that would flatter this body shape
            3. Suggest things to avoid for this body shape
            
            Format your response as a JSON object with this structure:
            {
              "body_shape": "<shape name>",
              "flattering_styles": ["<style 1>", "<style 2>", ...],
              "avoid": ["<avoid 1>", "<avoid 2>", ...],
              "explanation": "<brief explanation of the body shape characteristics>"
            }
            """
            
            # Select Gemini Pro Vision model
            model = genai.GenerativeModel('gemini-1.5-pro-vision')
            
            # Generate response
            response = model.generate_content([prompt, image_bytes])
            
            # Extract JSON from the response
            result_text = response.text
            
            # Try to parse JSON from the response
            try:
                # Find JSON in the response if it's wrapped in markdown blocks
                if "```json" in result_text:
                    json_content = result_text.split("```json")[1].split("```")[0].strip()
                    result_data = json.loads(json_content)
                else:
                    # Direct JSON parsing
                    result_data = json.loads(result_text)
                    
                return result_data
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON from Gemini body shape analysis: {e}")
                # If JSON parsing fails, structure response manually
                return {
                    "body_shape": "Unknown",
                    "flattering_styles": ["Could not determine"],
                    "avoid": ["Could not determine"],
                    "explanation": "Could not analyze body shape from the provided image.",
                    "raw_response": result_text
                }
                
        except Exception as e:
            logger.error(f"Error detecting body shape with Gemini: {str(e)}")
            return {
                "error": str(e),
                "body_shape": "Error in analysis"
            }
            
    def detect_fabric_and_brand(self, image_path):
        """Detect fabric type and possible brand from clothing image"""
        try:
            # Ensure the image exists
            if not os.path.exists(image_path):
                logger.error(f"Image not found: {image_path}")
                return {"error": "Image file not found"}
                
            # Convert image to bytes
            with open(image_path, "rb") as f:
                image_bytes = f.read()
            
            prompt = """
            Analyze this clothing item and identify:
            1. Fabric type (cotton, wool, polyester, silk, denim, etc.)
            2. Possible brand (if recognizable)
            3. Sustainability score (1-10, where 10 is most sustainable)
            4. Care instructions
            
            Format your response as a JSON object with this structure:
            {
              "fabric": "<fabric type>",
              "brand": "<brand name or 'Unknown'>",
              "sustainability_score": <number between 1 and 10>,
              "care": ["<care instruction 1>", "<care instruction 2>", ...],
              "explanation": "<brief explanation of fabric properties>"
            }
            """
            
            # Select Gemini Pro Vision model
            model = genai.GenerativeModel('gemini-1.5-pro-vision')
            
            # Generate response
            response = model.generate_content([prompt, image_bytes])
            
            # Extract JSON from the response
            result_text = response.text
            
            # Try to parse JSON from the response
            try:
                # Find JSON in the response if it's wrapped in markdown blocks
                if "```json" in result_text:
                    json_content = result_text.split("```json")[1].split("```")[0].strip()
                    result_data = json.loads(json_content)
                else:
                    # Direct JSON parsing
                    result_data = json.loads(result_text)
                    
                return result_data
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON from Gemini fabric analysis: {e}")
                # If JSON parsing fails, structure response manually
                return {
                    "fabric": "Unknown",
                    "brand": "Unknown",
                    "sustainability_score": 5,
                    "care": ["No information available"],
                    "explanation": "Could not analyze fabric from the provided image.",
                    "raw_response": result_text
                }
                
        except Exception as e:
            logger.error(f"Error detecting fabric with Gemini: {str(e)}")
            return {
                "error": str(e),
                "fabric": "Error in analysis",
                "brand": "Error in analysis"
            }
            
    def analyze_multiple_angles(self, image_paths):
        """Analyze outfit from multiple angles"""
        try:
            # Check if we have at least one image
            if not image_paths:
                return {"error": "No images provided"}
                
            # If only one image is provided, use the standard analyze_outfit method
            if len(image_paths) == 1:
                return self.analyze_outfit(image_paths[0])
                
            # Process multiple images
            image_bytes_list = []
            for path in image_paths:
                if not os.path.exists(path):
                    logger.warning(f"Image not found: {path}")
                    continue
                    
                with open(path, "rb") as f:
                    image_bytes_list.append(f.read())
                    
            if not image_bytes_list:
                return {"error": "None of the provided images could be loaded"}
                
            prompt = """
            Analyze this outfit from multiple angles and provide a comprehensive assessment:
            1. Overall rating (1-10)
            2. Style classification
            3. Color harmony assessment
            4. Fit analysis from different angles
            5. Suggested improvements
            6. Best occasions for this outfit
            
            Format the response as a JSON object.
            """
            
            # Select Gemini Pro Vision model
            model = genai.GenerativeModel('gemini-1.5-pro-vision')
            
            # Generate response with multiple images
            content_parts = [prompt] + image_bytes_list
            response = model.generate_content(content_parts)
            
            # Process response as with the single image method
            result_text = response.text
            
            try:
                if "```json" in result_text:
                    json_content = result_text.split("```json")[1].split("```")[0].strip()
                    result_data = json.loads(json_content)
                else:
                    result_data = json.loads(result_text)
                    
                # Add a field to indicate multi-angle analysis
                result_data["multi_angle"] = True
                result_data["angles_count"] = len(image_paths)
                
                return result_data
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON from multi-angle analysis: {e}")
                return {
                    "overall_score": 5,
                    "multi_angle": True,
                    "angles_count": len(image_paths),
                    "style": {"description": "Analysis failed", "score": 0},
                    "color": {"description": "Analysis failed", "score": 0},
                    "raw_response": result_text
                }
                
        except Exception as e:
            logger.error(f"Error in multi-angle analysis: {str(e)}")
            return {"error": str(e)}
            
    def get_seasonal_suggestions(self, wardrobe_items, season, location=None):
        """Get seasonal outfit suggestions"""
        try:
            # Prepare wardrobe data
            wardrobe_data = []
            for item in wardrobe_items:
                wardrobe_data.append({
                    "name": item["name"],
                    "category": item["category"]
                })
                
            prompt = f"""
            Based on this wardrobe: {json.dumps(wardrobe_data)},
            
            Generate outfit suggestions for the {season} season
            {"in " + location if location else ""}.
            
            Include:
            1. Top 3 outfit combinations appropriate for the season
            2. Suggestions for items that might be missing and would complete seasonal outfits
            3. Styling tips specific to this season
            
            Format as JSON.
            """
            
            # Use Gemini Pro for text-based suggestions
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(prompt)
            
            result_text = response.text
            
            try:
                if "```json" in result_text:
                    json_content = result_text.split("```json")[1].split("```")[0].strip()
                    result_data = json.loads(json_content)
                else:
                    result_data = json.loads(result_text)
                    
                return result_data
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON from seasonal suggestions: {e}")
                return {
                    "outfits": [],
                    "missing_items": [],
                    "styling_tips": [],
                    "error": "Could not generate seasonal suggestions",
                    "raw_response": result_text
                }
                
        except Exception as e:
            logger.error(f"Error generating seasonal suggestions: {str(e)}")
            return {"error": str(e)}
