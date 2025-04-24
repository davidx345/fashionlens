from backend.services.transformer_service import TransformerService

class AIAnalysisService:
    def __init__(self):
        self.transformer_service = TransformerService()
    
    def analyze_outfit(self, image_path):
        """
        Analyze outfit using transformer-based models
        """
        try:
            # Get analysis from transformer service
            analysis = self.transformer_service.analyze_image(image_path)
            
            if not analysis or "error" in analysis:
                return {"error": "Failed to analyze image"}
            
            return analysis
            
        except Exception as e:
            print(f"Error in AI analysis: {e}")
            return {"error": str(e)}