#!/usr/bin/env python3
"""
Direct database test to check user_id formats and data structure
"""

import os
import sys
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

def test_data_structure():
    """Test the database structure and data formats"""
    
    # Database connection
    mongo_uri = "mongodb+srv://xstati72:fashion123@fashionlens.ld2bx7j.mongodb.net/?retryWrites=true&w=majority&appName=FashionLens"
    db_name = "FashionLens"
    
    client = MongoClient(mongo_uri)
    db = client[db_name]
    
    print("=== DIRECT DATABASE ANALYSIS ===\n")
    
    # List all collections
    collections = db.list_collection_names()
    print(f"Available collections: {collections}")
    
    # Check users
    print("\n--- USERS ---")
    users = list(db.users.find({}, {'email': 1, '_id': 1}).limit(5))
    print(f"Total users: {db.users.count_documents({})}")
    
    for i, user in enumerate(users, 1):
        print(f"  {i}. ID: {user['_id']} (type: {type(user['_id'])}), Email: {user.get('email', 'N/A')}")
    
    if not users:
        print("❌ No users found!")
        return
    
    # Test with first user
    test_user = users[0]
    user_id_obj = test_user['_id']
    user_id_str = str(test_user['_id'])
    
    print(f"\n🔍 Testing with user:")
    print(f"   ObjectId: {user_id_obj}")
    print(f"   String: {user_id_str}")
    
    # Check analyses
    print("\n--- ANALYSES ---")
    print(f"Total analyses: {db.analyses.count_documents({})}")
    
    # Check with ObjectId
    analyses_obj = list(db.analyses.find({'user_id': user_id_obj}).limit(3))
    print(f"Analyses with ObjectId user_id: {len(analyses_obj)}")
    
    # Check with string
    analyses_str = list(db.analyses.find({'user_id': user_id_str}).limit(3))
    print(f"Analyses with string user_id: {len(analyses_str)}")
    
    # Show sample analysis structure
    all_analyses = list(db.analyses.find({}).limit(3))
    print(f"Sample analyses (any user):")
    for i, analysis in enumerate(all_analyses, 1):
        user_id = analysis.get('user_id')
        user_id_type = type(user_id)
        score = analysis.get('results', {}).get('overallScore', 'N/A')
        created = analysis.get('created_at', 'N/A')
        print(f"  {i}. user_id: {user_id} ({user_id_type}), score: {score}, created: {created}")
    
    # Check wardrobe
    print("\n--- WARDROBE ---")
    print(f"Total wardrobe items: {db.wardrobe.count_documents({})}")
    
    # Check with ObjectId
    wardrobe_obj = list(db.wardrobe.find({'user_id': user_id_obj}).limit(3))
    print(f"Wardrobe with ObjectId user_id: {len(wardrobe_obj)}")
    
    # Check with string
    wardrobe_str = list(db.wardrobe.find({'user_id': user_id_str}).limit(3))
    print(f"Wardrobe with string user_id: {len(wardrobe_str)}")
    
    # Show sample wardrobe structure
    all_wardrobe = list(db.wardrobe.find({}).limit(3))
    print(f"Sample wardrobe items (any user):")
    for i, item in enumerate(all_wardrobe, 1):
        user_id = item.get('user_id')
        user_id_type = type(user_id)
        name = item.get('name', 'N/A')
        created = item.get('created_at', 'N/A')
        print(f"  {i}. user_id: {user_id} ({user_id_type}), name: {name}, created: {created}")
    
    # Test JWT scenario - what happens when JWT returns string
    print("\n--- JWT SIMULATION ---")
    jwt_user_id = user_id_str  # JWT always returns string
    
    print(f"JWT user_id: {jwt_user_id} (type: {type(jwt_user_id)})")
    
    # Dashboard queries with JWT string
    total_analyses = db.analyses.count_documents({'user_id': jwt_user_id})
    total_wardrobe = db.wardrobe.count_documents({'user_id': jwt_user_id})
    
    print(f"Dashboard results with JWT string:")
    print(f"  Total analyses: {total_analyses}")
    print(f"  Total wardrobe: {total_wardrobe}")
    
    # Aggregation test
    pipeline = [
        {'$match': {'user_id': jwt_user_id}},
        {'$group': {
            '_id': None,
            'avg_score': {'$avg': '$results.overallScore'}
        }}
    ]
    avg_score_result = list(db.analyses.aggregate(pipeline))
    avg_score = avg_score_result[0]['avg_score'] if avg_score_result else 0
    print(f"  Average score: {avg_score}")
    
    # Summary
    print("\n=== DIAGNOSIS ===")
    if total_analyses == 0 and total_wardrobe == 0:
        print("❌ PROBLEM: No data found with JWT string user_id")
        print("💡 SOLUTION: Need to convert user_ids from ObjectId to string in database")
        print("    OR modify dashboard queries to use ObjectId")
    else:
        print("✅ Data found with JWT string format - dashboard should work!")
    
    client.close()

if __name__ == "__main__":
    try:
        test_data_structure()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
