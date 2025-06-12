from bson.objectid import ObjectId
from backend.utils.db import get_db, serialize_doc
import datetime

class WardrobeItem:
    """Wardrobe item model for managing clothing items"""
    
    @staticmethod
    def create(user_id, item_data):
        """Create a new wardrobe item"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Create item document
        item = {
            'user_id': user_id,
            'name': item_data.get('name'),
            'category': item_data.get('category'),
            'color': item_data.get('color'),
            'season': item_data.get('season', 'all'),
            'image': item_data.get('image'),
            'created_at': datetime.datetime.utcnow()
        }
        
        # Insert item into database
        result = db.wardrobe_items.insert_one(item)
        item['_id'] = result.inserted_id
        
        return serialize_doc(item)
    
    @staticmethod
    def get_by_user(user_id):
        """Get all wardrobe items for a user"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Find items by user ID
        items = list(db.wardrobe_items.find({'user_id': user_id}))
        return serialize_doc(items)
    
    @staticmethod
    def get_by_id(item_id):
        """Get wardrobe item by ID"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(item_id, str):
            item_id = ObjectId(item_id)
            
        # Find item by ID
        item = db.wardrobe_items.find_one({'_id': item_id})
        return serialize_doc(item)
    
    @staticmethod
    def update(item_id, update_data):
        """Update wardrobe item"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(item_id, str):
            item_id = ObjectId(item_id)
            
        # Update item document
        result = db.wardrobe_items.update_one(
            {'_id': item_id},
            {'$set': update_data}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    def delete(item_id):
        """Delete wardrobe item"""
        db = get_db()
        
        # Convert string ID to ObjectId if necessary
        if isinstance(item_id, str):
            item_id = ObjectId(item_id)
            
        # Delete item document
        result = db.wardrobe_items.delete_one({'_id': item_id})
        
        return result.deleted_count > 0
