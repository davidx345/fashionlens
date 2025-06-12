import numpy as np
from backend.utils.db import get_db
from bson.objectid import ObjectId

class OutfitRecommender:
    """Class for generating outfit recommendations"""
    
    @staticmethod
    def generate_outfit_recommendations(user_id, count=3):
        """Generate outfit recommendations for a user"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Get user's wardrobe items
        wardrobe_items = list(db.wardrobe_items.find({'user_id': user_id}))
        
        # Get user's style preferences
        user = db.users.find_one({'_id': user_id})
        preferences = user.get('preferences', {})
        
        # Get user's previous analyses for style insights
        analyses = list(
            db.analyses.find({'user_id': user_id})
            .sort('created_at', -1)
            .limit(5)
        )
        
        # If user has no wardrobe items, return mock recommendations
        if not wardrobe_items:
            return OutfitRecommender._mock_outfit_recommendations(count)
            
        # Group items by category
        items_by_category = {}
        for item in wardrobe_items:
            category = item.get('category')
            if category not in items_by_category:
                items_by_category[category] = []
            items_by_category[category].append(item)
            
        # Generate outfit recommendations
        recommendations = []
        
        # Define outfit templates
        outfit_templates = [
            {
                'name': 'Business Casual',
                'description': 'Perfect for office days',
                'categories': ['tops', 'bottoms', 'footwear'],
                'score': round(8.5 + np.random.random(), 1)
            },
            {
                'name': 'Weekend Casual',
                'description': 'Relaxed weekend look',
                'categories': ['tops', 'bottoms', 'footwear'],
                'score': round(8.0 + np.random.random(), 1)
            },
            {
                'name': 'Smart Evening',
                'description': 'For dinner or evening events',
                'categories': ['tops', 'bottoms', 'footwear'],
                'score': round(8.5 + np.random.random(), 1)
            },
            {
                'name': 'Layered Look',
                'description': 'Stylish layered outfit',
                'categories': ['tops', 'outerwear', 'bottoms', 'footwear'],
                'score': round(8.0 + np.random.random(), 1)
            }
        ]
        
        # Generate recommendations based on templates
        for template in outfit_templates[:count]:
            outfit_items = []
            
            # Select items for each category in the template
            for category in template['categories']:
                if category in items_by_category and items_by_category[category]:
                    # Select a random item from the category
                    item = np.random.choice(items_by_category[category])
                    outfit_items.append({
                        'name': item.get('name'),
                        'image': item.get('image')
                    })
            
            # Only add recommendation if we have items for all categories
            if len(outfit_items) == len(template['categories']):
                recommendation = {
                    'name': template['name'],
                    'description': template['description'],
                    'score': template['score'],
                    'items': outfit_items,
                    'image': '/placeholder.svg?height=300&width=300&text=' + template['name'].replace(' ', '+')
                }
                recommendations.append(recommendation)
        
        # If we don't have enough recommendations, add mock ones
        if len(recommendations) < count:
            mock_recommendations = OutfitRecommender._mock_outfit_recommendations(count - len(recommendations))
            recommendations.extend(mock_recommendations)
            
        return recommendations
    
    @staticmethod
    def generate_seasonal_recommendations(user_id, season='fall'):
        """Generate seasonal recommendations for a user"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Get user's wardrobe items
        wardrobe_items = list(db.wardrobe_items.find({'user_id': user_id}))
        
        # Define seasonal recommendations
        seasonal_templates = {
            'fall': {
                'name': 'Fall Essentials',
                'description': 'Must-have items for fall',
                'items': [
                    {'name': 'Beige Trench Coat', 'image': '/placeholder.svg?height=100&width=100&text=Trench+Coat'},
                    {'name': 'Burgundy Sweater', 'image': '/placeholder.svg?height=100&width=100&text=Burgundy+Sweater'},
                    {'name': 'Brown Boots', 'image': '/placeholder.svg?height=100&width=100&text=Brown+Boots'}
                ]
            },
            'winter': {
                'name': 'Winter Staples',
                'description': 'Stay warm and stylish',
                'items': [
                    {'name': 'Gray Wool Coat', 'image': '/placeholder.svg?height=100&width=100&text=Wool+Coat'},
                    {'name': 'Black Turtleneck', 'image': '/placeholder.svg?height=100&width=100&text=Turtleneck'},
                    {'name': 'Thermal Socks', 'image': '/placeholder.svg?height=100&width=100&text=Thermal+Socks'}
                ]
            },
            'spring': {
                'name': 'Spring Refresh',
                'description': 'Refresh your wardrobe for spring',
                'items': [
                    {'name': 'Light Jacket', 'image': '/placeholder.svg?height=100&width=100&text=Light+Jacket'},
                    {'name': 'Floral Dress', 'image': '/placeholder.svg?height=100&width=100&text=Floral+Dress'},
                    {'name': 'Canvas Sneakers', 'image': '/placeholder.svg?height=100&width=100&text=Canvas+Sneakers'}
                ]
            },
            'summer': {
                'name': 'Summer Essentials',
                'description': 'Stay cool and stylish',
                'items': [
                    {'name': 'Linen Shirt', 'image': '/placeholder.svg?height=100&width=100&text=Linen+Shirt'},
                    {'name': 'Shorts', 'image': '/placeholder.svg?height=100&width=100&text=Shorts'},
                    {'name': 'Sandals', 'image': '/placeholder.svg?height=100&width=100&text=Sandals'}
                ]
            }
        }
        
        # Get seasonal template
        if season not in seasonal_templates:
            season = 'fall'
            
        template = seasonal_templates[season]
        
        # Check if user already has these items
        user_items = set(item.get('name', '').lower() for item in wardrobe_items)
        
        # Filter out items user already has
        filtered_items = []
        for item in template['items']:
            if item['name'].lower() not in user_items:
                filtered_items.append(item)
                
        # If all items filtered out, use original items
        if not filtered_items:
            filtered_items = template['items']
            
        recommendation = {
            'name': template['name'],
            'description': template['description'],
            'items': filtered_items
        }
        
        return [recommendation]
    
    @staticmethod
    def _mock_outfit_recommendations(count=3):
        """Generate mock outfit recommendations"""
        mock_recommendations = [
            {
                'id': '1',
                'name': 'Business Casual',
                'description': 'Perfect for office days',
                'score': 9.2,
                'items': [
                    {'name': 'Blue Oxford Shirt', 'image': '/placeholder.svg?height=100&width=100&text=Blue+Shirt'},
                    {'name': 'Khaki Chinos', 'image': '/placeholder.svg?height=100&width=100&text=Khaki+Chinos'},
                    {'name': 'Brown Leather Shoes', 'image': '/placeholder.svg?height=100&width=100&text=Brown+Shoes'}
                ],
                'image': '/placeholder.svg?height=300&width=300&text=Business+Casual'
            },
            {
                'id': '2',
                'name': 'Weekend Casual',
                'description': 'Relaxed weekend look',
                'score': 8.7,
                'items': [
                    {'name': 'Gray T-Shirt', 'image': '/placeholder.svg?height=100&width=100&text=Gray+Tshirt'},
                    {'name': 'Blue Jeans', 'image': '/placeholder.svg?height=100&width=100&text=Blue+Jeans'},
                    {'name': 'White Sneakers', 'image': '/placeholder.svg?height=100&width=100&text=White+Sneakers'}
                ],
                'image': '/placeholder.svg?height=300&width=300&text=Weekend+Casual'
            },
            {
                'id': '3',
                'name': 'Smart Evening',
                'description': 'For dinner or evening events',
                'score': 9.0,
                'items': [
                    {'name': 'Black Shirt', 'image': '/placeholder.svg?height=100&width=100&text=Black+Shirt'},
                    {'name': 'Dark Jeans', 'image': '/placeholder.svg?height=100&width=100&text=Dark+Jeans'},
                    {'name': 'Black Leather Shoes', 'image': '/placeholder.svg?height=100&width=100&text=Black+Shoes'}
                ],
                'image': '/placeholder.svg?height=300&width=300&text=Smart+Evening'
            }
        ]
        
        return mock_recommendations[:count]
