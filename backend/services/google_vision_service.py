from google.cloud import vision
import os
from typing import List, Dict

class GoogleVisionService:
    def __init__(self, credentials_path: str):
        """
        Initialize Google Vision client
        Args:
            credentials_path: Path to Google Cloud credentials JSON file
        """
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
        self.client = vision.ImageAnnotatorClient()

    def analyze_image(self, image_path: str) -> Dict:
        """
        Analyze image using Google Vision API
        """
        try:
            # Check if credentials file exists
            if not os.path.exists(os.environ['GOOGLE_APPLICATION_CREDENTIALS']):
                print(f"Credentials file not found at: {os.environ['GOOGLE_APPLICATION_CREDENTIALS']}")
                return None

            # Check if image file exists
            if not os.path.exists(image_path):
                print(f"Image file not found at: {image_path}")
                return None

            # Read image file
            with open(image_path, 'rb') as image_file:
                content = image_file.read()

            image = vision.Image(content=content)

            # Perform detection tasks
            try:
                labels = self.client.label_detection(image=image)
                objects = self.client.object_localization(image=image)
                colors = self.client.image_properties(image=image)
            except Exception as api_error:
                print(f"Google Vision API error: {api_error}")
                return None

            # Process results
            analysis = {
                'style': self._process_labels(labels),
                'objects': self._process_objects(objects),
                'colors': self._process_colors(colors),
                'overall_score': self._calculate_overall_score(labels)
            }

            return analysis

        except Exception as e:
            print(f"Error analyzing image: {e}")
            return None

    def _process_labels(self, labels) -> List[Dict]:
        return [{
            'description': label.description,
            'score': round(label.score * 10, 2)
        } for label in labels.label_annotations]

    def _process_objects(self, objects) -> List[Dict]:
        return [{
            'name': obj.name,
            'confidence': round(obj.score * 10, 2)
        } for obj in objects.localized_object_annotations]

    def _process_colors(self, colors) -> List[Dict]:
        return [{
            'red': color.color.red,
            'green': color.color.green,
            'blue': color.color.blue,
            'score': round(color.score * 10, 2)
        } for color in colors.image_properties_annotation.dominant_colors.colors]

    def _calculate_overall_score(self, labels) -> float:
        if not labels.label_annotations:
            return 0
        return round(sum(label.score for label in labels.label_annotations) * 10 / len(labels.label_annotations), 2)