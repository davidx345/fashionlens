from backend.services.gemini_service import GeminiService
import logging

logger = logging.getLogger(__name__)

class AIAnalysisService:
    def __init__(self):
        try:
            self.gemini_service = GeminiService()
            logger.info("AI Analysis Service initialized with Gemini")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini service: {e}")
            raise
    
    def analyze_outfit(self, image_path):
        """
        Analyze outfit using Gemini Vision API
        """
        try:
            # Get analysis from Gemini service
            analysis = self.gemini_service.analyze_outfit(image_path)
            
            if not analysis or "error" in analysis:
                return {"error": "Failed to analyze image"}
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in AI analysis: {e}")
            return {"error": str(e)}
    
    def analyze_multiple_angles(self, image_paths):
        """
        Analyze outfit from multiple angles
        """
        try:
            return self.gemini_service.analyze_multiple_angles(image_paths)
        except Exception as e:
            logger.error(f"Error in multi-angle analysis: {e}")
            return {"error": str(e)}
    
    def get_outfit_recommendations(self, wardrobe_items, occasion=None, season=None):
        """
        Get outfit recommendations based on user's wardrobe
        """
        try:
            return self.gemini_service.get_outfit_recommendations(wardrobe_items, occasion, season)
        except Exception as e:
            logger.error(f"Error getting outfit recommendations: {e}")
            return [{"error": str(e)}]
    
    def detect_body_shape(self, image_path):
        """
        Analyze body shape and provide style advice
        """
        try:
            return self.gemini_service.detect_body_shape(image_path)
        except Exception as e:
            logger.error(f"Error in body shape analysis: {e}")
            return {"error": str(e)}
    
    def detect_fabric_and_brand(self, image_path):
        """
        Identify fabric type and brand from image
        """
        try:
            return self.gemini_service.detect_fabric_and_brand(image_path)
        except Exception as e:
            logger.error(f"Error in fabric analysis: {e}")
            return {"error": str(e)}
            
    def get_seasonal_suggestions(self, wardrobe_items, season, location=None):
        """
        Get seasonal outfit suggestions
        """
        try:
            return self.gemini_service.get_seasonal_suggestions(wardrobe_items, season, location)
        except Exception as e:
            logger.error(f"Error getting seasonal suggestions: {e}")
            return {"error": str(e)}