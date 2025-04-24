from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import os

class TransformerService:
    def __init__(self):
        # Initialize CLIP model and processor
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        
        # Define fashion categories and attributes
        self.style_categories = [
            "casual outfit", "formal outfit", "business casual",
            "sporty outfit", "streetwear", "vintage style",
            "bohemian style", "minimalist style", "elegant outfit"
        ]
        
        self.color_categories = [
            "bright colors", "dark colors", "neutral colors",
            "monochrome outfit", "colorful outfit", "pastel colors"
        ]
        
        self.occasion_categories = [
            "work appropriate", "party outfit", "casual everyday",
            "gym wear", "beach outfit", "formal event"
        ]

    def analyze_image(self, image_path):
        """
        Analyze an image using CLIP model
        """
        try:
            # Load and process image
            if not os.path.exists(image_path):
                return self._get_error_response("Image file not found")

            image = Image.open(image_path)
            inputs = self.processor(images=image, return_tensors="pt")
            
            # Analyze style
            style_results = self._analyze_categories(inputs, self.style_categories)
            color_results = self._analyze_categories(inputs, self.color_categories)
            occasion_results = self._analyze_categories(inputs, self.occasion_categories)
            
            if not all([style_results, color_results, occasion_results]):
                return self._get_error_response("Failed to analyze image categories")

            # Compile results
            top_style = style_results[0]
            top_color = color_results[0]
            top_occasion = occasion_results[0]
            
            overall_score = (top_style["score"] + top_color["score"] + top_occasion["score"]) / 3
            
            return {
                "style": {
                    "description": top_style["category"],
                    "score": round(top_style["score"] * 10, 2)
                },
                "color": {
                    "description": top_color["category"],
                    "score": round(top_color["score"] * 10, 2)
                },
                "occasion": {
                    "description": top_occasion["category"],
                    "score": round(top_occasion["score"] * 10, 2)
                },
                "suggestions": [
                    f"This outfit appears to be {top_style['category'].lower()}",
                    f"The color scheme is {top_color['category'].lower()}",
                    f"Best suited for {top_occasion['category'].lower()} occasions"
                ],
                "overall_score": round(overall_score * 10, 2)
            }
            
        except Exception as e:
            return self._get_error_response(str(e))

    def _analyze_categories(self, image_inputs, categories):
        """
        Analyze image against a list of categories
        """
        try:
            text_inputs = self.processor(text=categories, return_tensors="pt", padding=True)
            
            with torch.no_grad():
                outputs = self.model(**{
                    'input_ids': text_inputs.input_ids,
                    'attention_mask': text_inputs.attention_mask,
                    'pixel_values': image_inputs.pixel_values
                })
            
            # Calculate probabilities
            probs = outputs.logits_per_image.softmax(dim=1)[0]
            results = [
                {"category": cat, "score": float(score)}
                for cat, score in zip(categories, probs)
            ]
            
            # Sort by score
            return sorted(results, key=lambda x: x['score'], reverse=True)
        except Exception as e:
            print(f"Error in category analysis: {e}")
            return None

    def _get_error_response(self, error_message):
        """
        Return a standardized error response
        """
        return {
            "error": error_message,
            "style": {"description": "Not available", "score": 0},
            "color": {"description": "Not available", "score": 0},
            "occasion": {"description": "Not available", "score": 0},
            "suggestions": ["Unable to analyze image"],
            "overall_score": 0
        }