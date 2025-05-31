#!/usr/bin/env python3
"""
Show detailed analysis of the data mismatch issue
"""

import os
import sys
from pymongo import MongoClient
from bson import ObjectId

def show_data_details():
    """Show detailed data to understand the mismatch"""
    
    mongo_uri = "mongodb+srv://xstati72:fashion123@fashionlens.ld2bx7j.mongodb.net/?retryWrites=true&w=majority&appName=FashionLens"
    db_name = "FashionLens"
    
    client = MongoClient(mongo_uri)
    db = client[db_name]
    
    print("=== DETAILED DATA ANALYSIS ===\n")
    
    # Get the user
    user = db.users.find_one({})
    user_id_obj = user['_id']
    user_id_str = str(user['_id'])
    
    print(f"User ID as ObjectId: {user_id_obj}")
    print(f"User ID as String: {user_id_str}")
    
    # Show all analyses
    analyses = list(db.analyses.find({}))
    print(f"\nTotal analyses in database: {len(analyses)}")
    
    for i, analysis in enumerate(analyses, 1):
        user_id = analysis.get('user_id')
        score = analysis.get('results', {}).get('overallScore', 'N/A')
        created = analysis.get('created_at', 'N/A')
        print(f"  {i}. user_id: {user_id} (type: {type(user_id)})")
        print(f"     score: {score}, created: {created}")
        print(f"     matches ObjectId: {user_id == user_id_obj}")
        print(f"     matches String: {user_id == user_id_str}")
        print()
    
    # Check wardrobe_items (note: might be 'wardrobe_items' not 'wardrobe')
    wardrobe = list(db.wardrobe_items.find({}))
    print(f"Total wardrobe_items: {len(wardrobe)}")
    
    for i, item in enumerate(wardrobe, 1):
        user_id = item.get('user_id')
        name = item.get('name', 'N/A')
        created = item.get('created_at', 'N/A')
        print(f"  {i}. user_id: {user_id} (type: {type(user_id)})")
        print(f"     name: {name}, created: {created}")
        print(f"     matches ObjectId: {user_id == user_id_obj}")
        print(f"     matches String: {user_id == user_id_str}")
        print()
    
    client.close()

if __name__ == "__main__":
    try:
        show_data_details()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
