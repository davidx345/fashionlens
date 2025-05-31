#!/usr/bin/env python3
"""
Test script to check what data exists in the database for dashboard functionality.
"""

import os
import sys
from datetime import datetime, timedelta

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Mock Flask app for database initialization
class MockApp:
    def __init__(self):
        self.config = {
            'MONGO_URI': os.getenv('MONGO_URI', 'mongodb://localhost:27017/fashion_analysis')
        }

def test_dashboard_data():
    """Test the dashboard data queries"""
    
    # Initialize database
    from utils.db import initialize_db, get_db
    
    app = MockApp()
    db = initialize_db(app)
    
    print("=== DASHBOARD DATA ANALYSIS ===\n")
    
    # Check users
    users = list(db.users.find({}, {'email': 1, '_id': 1}))
    print(f"Users in database: {len(users)}")
    for user in users:
        print(f"  - ID: {user['_id']}, Email: {user.get('email', 'N/A')}")
    
    if not users:
        print("❌ No users found! Cannot test dashboard data without users.")
        return
    
    # Use the first user for testing
    test_user_id = str(users[0]['_id'])
    print(f"\n🔍 Testing with user ID: {test_user_id}")
    
    # Check analyses
    print("\n--- ANALYSES ---")
    analyses = list(db.analyses.find({'user_id': test_user_id}))
    print(f"Analyses for user: {len(analyses)}")
    
    if analyses:
        for i, analysis in enumerate(analyses[:3], 1):
            score = analysis.get('results', {}).get('overallScore', 'N/A')
            created = analysis.get('created_at', 'N/A')
            print(f"  {i}. Score: {score}, Created: {created}")
    else:
        print("  ❌ No analyses found for this user")
    
    # Check wardrobe items
    print("\n--- WARDROBE ITEMS ---")
    wardrobe = list(db.wardrobe.find({'user_id': test_user_id}))
    print(f"Wardrobe items for user: {len(wardrobe)}")
    
    if wardrobe:
        for i, item in enumerate(wardrobe[:3], 1):
            name = item.get('name', 'N/A')
            created = item.get('created_at', 'N/A')
            print(f"  {i}. Name: {name}, Created: {created}")
    else:
        print("  ❌ No wardrobe items found for this user")
    
    # Test the actual dashboard queries
    print("\n--- DASHBOARD ANALYTICS SIMULATION ---")
    
    # Total analyses
    total_analyses = db.analyses.count_documents({'user_id': test_user_id})
    print(f"Total analyses: {total_analyses}")
    
    # Analyses from last month
    one_month_ago = datetime.utcnow() - timedelta(days=30)
    last_month_analyses = db.analyses.count_documents({
        'user_id': test_user_id,
        'created_at': {'$gte': one_month_ago}
    })
    print(f"Last month analyses: {last_month_analyses}")
    
    # Wardrobe items
    total_wardrobe_items = db.wardrobe.count_documents({'user_id': test_user_id})
    print(f"Total wardrobe items: {total_wardrobe_items}")
    
    # New wardrobe items from last month
    new_wardrobe_items = db.wardrobe.count_documents({
        'user_id': test_user_id,
        'created_at': {'$gte': one_month_ago}
    })
    print(f"New wardrobe items (last month): {new_wardrobe_items}")
    
    # Average style score
    pipeline = [
        {'$match': {'user_id': test_user_id}},
        {'$group': {
            '_id': None,
            'avg_score': {'$avg': '$results.overallScore'}
        }}
    ]
    avg_score_result = list(db.analyses.aggregate(pipeline))
    avg_style_score = round(avg_score_result[0]['avg_score'], 1) if avg_score_result else 0
    print(f"Average style score: {avg_style_score}")
    
    # Check if there are any data type issues
    print("\n--- DATA VALIDATION ---")
    
    # Check if user_id is stored as string or ObjectId
    analyses_with_objectid = db.analyses.count_documents({'user_id': users[0]['_id']})
    analyses_with_string = db.analyses.count_documents({'user_id': str(users[0]['_id'])})
    
    print(f"Analyses with ObjectId user_id: {analyses_with_objectid}")
    print(f"Analyses with string user_id: {analyses_with_string}")
    
    wardrobe_with_objectid = db.wardrobe.count_documents({'user_id': users[0]['_id']})
    wardrobe_with_string = db.wardrobe.count_documents({'user_id': str(users[0]['_id'])})
    
    print(f"Wardrobe with ObjectId user_id: {wardrobe_with_objectid}")
    print(f"Wardrobe with string user_id: {wardrobe_with_string}")
    
    # Summary
    print("\n=== SUMMARY ===")
    if total_analyses > 0 or total_wardrobe_items > 0:
        print("✅ Data exists for dashboard")
        if analyses_with_string > 0 and wardrobe_with_string > 0:
            print("✅ Data uses string user_ids (correct format)")
        elif analyses_with_objectid > 0 and wardrobe_with_objectid > 0:
            print("⚠️  Data uses ObjectId user_ids (may cause issues with JWT string)")
        else:
            print("⚠️  Mixed user_id formats detected")
    else:
        print("❌ No data available for dashboard")

if __name__ == "__main__":
    try:
        test_dashboard_data()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
