from datetime import datetime
from bson import ObjectId
from slugify import slugify
import logging

logger = logging.getLogger(__name__)

class WardrobeItem:
    """Model for storing wardrobe items"""
    
    CATEGORIES = [
        "tops", "bottoms", "dresses", "outerwear", 
        "shoes", "accessories", "other"
    ]
    
    def __init__(self, db):
        """Initialize with database connection"""
        self.db = db
        self.collection = db.db.wardrobe_items
        self.users = db.db.users
    
    def add_item(self, user_id, name, category, image_url, properties=None):
        """Add a new item to user's wardrobe"""
        try:
            if category not in self.CATEGORIES:
                category = "other"
                
            if properties is None:
                properties = {}
                
            item = {
                "name": name,
                "category": category,
                "image_url": image_url,
                "properties": properties,
                "created_at": datetime.utcnow(),
                "slug": slugify(name),
                "user_id": ObjectId(user_id)
            }
            
            # Add item to wardrobe collection
            result = self.collection.insert_one(item)
            item_id = result.inserted_id
            
            # Add reference to user's wardrobe array
            self.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {"wardrobe": ObjectId(item_id)}}
            )
            
            return str(item_id)
        except Exception as e:
            logger.error(f"Error adding wardrobe item: {e}")
            raise
    
    def get_user_wardrobe(self, user_id, category=None):
        """Get all wardrobe items for a user"""
        try:
            # Create a query to retrieve the items
            query = {"user_id": ObjectId(user_id)}
            if category:
                query["category"] = category
                
            # Retrieve the items
            items = list(self.collection.find(query))
            
            # Convert ObjectId to string
            for item in items:
                item["_id"] = str(item["_id"])
                item["user_id"] = str(item["user_id"])
                
            return items
        except Exception as e:
            logger.error(f"Error retrieving wardrobe: {e}")
            return []
            
    def delete_item(self, user_id, item_id):
        """Delete an item from user's wardrobe"""
        try:
            # Remove the reference from the user document
            self.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$pull": {"wardrobe": ObjectId(item_id)}}
            )
            
            # Delete the actual item
            self.collection.delete_one({"_id": ObjectId(item_id)})
            return True
        except Exception as e:
            logger.error(f"Error deleting item: {e}")
            return False
