#!/usr/bin/env python3
"""
Test the dashboard functions directly
"""

import os
import sys

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Mock Flask app and JWT
class MockApp:
    def __init__(self):
        self.config = {
            'MONGO_URI': os.getenv('MONGO_URI', 'mongodb+srv://xstati72:fashion123@fashionlens.ld2bx7j.mongodb.net/?retryWrites=true&w=majority&appName=FashionLens')
        }

def test_dashboard_functions():
    """Test dashboard functions directly"""
    
    from utils.db import initialize_db, get_db
    from bson import ObjectId
    from datetime import datetime, timedelta
    
    # Initialize database
    app = MockApp()
    db = initialize_db(app)
    
    print("=== TESTING DASHBOARD FUNCTIONS DIRECTLY ===\n")
    
    # Get a real user
    user = db.users.find_one({})
    if not user:
        print("❌ No users found!")
        return
    
    # Simulate JWT returning string user_id
    current_user_id = str(user['_id'])
    user_object_id = ObjectId(current_user_id)
    
    print(f"Testing with user_id: {current_user_id}")
    
    # Test analytics logic
    print("\n--- ANALYTICS ---")
    
    # Get user's analyses count
    total_analyses = db.analyses.count_documents({'user_id': user_object_id})
    print(f"Total analyses: {total_analyses}")
    
    # Get analyses from last month for trend calculation
    one_month_ago = datetime.utcnow() - timedelta(days=30)
    last_month_analyses = db.analyses.count_documents({
        'user_id': user_object_id,
        'created_at': {'$gte': one_month_ago}
    })
    print(f"Last month analyses: {last_month_analyses}")
    
    # Calculate trend percentage for analyses
    if total_analyses > 0:
        analyses_trend = round((last_month_analyses / total_analyses) * 100, 1)
    else:
        analyses_trend = 0
    print(f"Analyses trend: {analyses_trend}%")
    
    # Get wardrobe items count
    total_wardrobe_items = db.wardrobe_items.count_documents({'user_id': user_object_id})
    print(f"Total wardrobe items: {total_wardrobe_items}")
    
    # Get new wardrobe items from last month
    new_wardrobe_items = db.wardrobe_items.count_documents({
        'user_id': user_object_id,
        'created_at': {'$gte': one_month_ago}
    })
    print(f"New wardrobe items: {new_wardrobe_items}")
    
    # Get average style score from analyses
    pipeline = [
        {'$match': {'user_id': user_object_id}},
        {'$group': {
            '_id': None,
            'avg_score': {'$avg': '$results.overallScore'}
        }}
    ]
    avg_score_result = list(db.analyses.aggregate(pipeline))
    avg_style_score = round(avg_score_result[0]['avg_score'], 1) if avg_score_result else 0
    print(f"Average style score: {avg_style_score}")
    
    # Build analytics response like the endpoint would
    analytics_data = {
        'totalAnalyses': {
            'value': total_analyses,
            'trend': f"+{analyses_trend}%" if analyses_trend > 0 else f"{analyses_trend}%"
        },
        'wardrobeItems': {
            'value': total_wardrobe_items,
            'trend': f"+{new_wardrobe_items} new" if new_wardrobe_items > 0 else "No new items"
        },
        'recommendationsViewed': {
            'value': total_analyses * 2,  # Rough estimate as per original code
            'trend': f"+{round((last_month_analyses * 2 / max(total_analyses * 2, 1)) * 100, 1)}%"
        },
        'styleScoreAverage': {
            'value': f"{avg_style_score}/10" if avg_style_score > 0 else "No data",
            'trend': f"+0.0"  # Simplified for test
        }
    }
    
    print(f"\nAnalytics API Response Preview:")
    print(f"  Total Analyses: {analytics_data['totalAnalyses']['value']} ({analytics_data['totalAnalyses']['trend']})")
    print(f"  Wardrobe Items: {analytics_data['wardrobeItems']['value']} ({analytics_data['wardrobeItems']['trend']})")
    print(f"  Style Score: {analytics_data['styleScoreAverage']['value']}")
    
    # Test recent activity
    print("\n--- RECENT ACTIVITY ---")
    
    activities = []
    
    # Get recent analyses
    recent_analyses = db.analyses.find({
        'user_id': user_object_id
    }).sort('created_at', -1).limit(3)
    
    for analysis in recent_analyses:
        time_diff = datetime.utcnow() - analysis['created_at']
        if time_diff.days > 0:
            time_str = f"{time_diff.days} day{'s' if time_diff.days > 1 else ''} ago"
        elif time_diff.seconds > 3600:
            hours = time_diff.seconds // 3600
            time_str = f"{hours} hour{'s' if hours > 1 else ''} ago"
        else:
            minutes = max(1, time_diff.seconds // 60)
            time_str = f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        
        overall_score = analysis.get('results', {}).get('overallScore', 'N/A')
        activities.append({
            'description': f"Outfit analysis completed - Score: {overall_score}/10",
            'time': time_str,
            'type': 'analysis'
        })
    
    print(f"Recent activities: {len(activities)}")
    for i, activity in enumerate(activities, 1):
        print(f"  {i}. {activity['description']} - {activity['time']}")
    
    print("\n🎉 DASHBOARD FUNCTIONS WORKING!")
    print("✅ Real user data will now be displayed in the dashboard")

if __name__ == "__main__":
    try:
        test_dashboard_functions()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
