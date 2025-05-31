#!/usr/bin/env python3
"""
Test the dashboard endpoints after fixing the user_id issue
"""

import os
import sys
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta

def test_dashboard_queries():
    """Test the dashboard queries with ObjectId conversion"""
    
    mongo_uri = "mongodb+srv://xstati72:fashion123@fashionlens.ld2bx7j.mongodb.net/?retryWrites=true&w=majority&appName=FashionLens"
    db_name = "FashionLens"
    
    client = MongoClient(mongo_uri)
    db = client[db_name]
    
    print("=== TESTING FIXED DASHBOARD QUERIES ===\n")
    
    # Get the user
    user = db.users.find_one({})
    if not user:
        print("❌ No users found!")
        return
    
    # Simulate JWT behavior - JWT returns string user_id
    current_user_id = str(user['_id'])  # This is what JWT returns
    user_object_id = ObjectId(current_user_id)  # This is what we convert to
    
    print(f"JWT user_id (string): {current_user_id}")
    print(f"Converted to ObjectId: {user_object_id}")
    
    # Test analytics queries
    print("\n--- ANALYTICS QUERIES ---")
    
    # Total analyses
    total_analyses = db.analyses.count_documents({'user_id': user_object_id})
    print(f"✅ Total analyses: {total_analyses}")
    
    # Analyses from last month
    one_month_ago = datetime.utcnow() - timedelta(days=30)
    last_month_analyses = db.analyses.count_documents({
        'user_id': user_object_id,
        'created_at': {'$gte': one_month_ago}
    })
    print(f"✅ Last month analyses: {last_month_analyses}")
    
    # Wardrobe items (using correct collection name)
    total_wardrobe_items = db.wardrobe_items.count_documents({'user_id': user_object_id})
    print(f"✅ Total wardrobe items: {total_wardrobe_items}")
    
    # New wardrobe items from last month
    new_wardrobe_items = db.wardrobe_items.count_documents({
        'user_id': user_object_id,
        'created_at': {'$gte': one_month_ago}
    })
    print(f"✅ New wardrobe items (last month): {new_wardrobe_items}")
    
    # Average style score
    pipeline = [
        {'$match': {'user_id': user_object_id}},
        {'$group': {
            '_id': None,
            'avg_score': {'$avg': '$results.overallScore'}
        }}
    ]
    avg_score_result = list(db.analyses.aggregate(pipeline))
    avg_style_score = round(avg_score_result[0]['avg_score'], 1) if avg_score_result else 0
    print(f"✅ Average style score: {avg_style_score}")
    
    # Test recent activity queries
    print("\n--- RECENT ACTIVITY QUERIES ---")
    
    # Recent analyses
    recent_analyses = list(db.analyses.find({
        'user_id': user_object_id
    }).sort('created_at', -1).limit(3))
    print(f"✅ Recent analyses: {len(recent_analyses)}")
    
    for i, analysis in enumerate(recent_analyses, 1):
        score = analysis.get('results', {}).get('overallScore', 'N/A')
        created = analysis.get('created_at', 'N/A')
        print(f"   {i}. Score: {score}, Created: {created}")
    
    # Recent wardrobe additions
    recent_wardrobe = list(db.wardrobe_items.find({
        'user_id': user_object_id
    }).sort('created_at', -1).limit(2))
    print(f"✅ Recent wardrobe additions: {len(recent_wardrobe)}")
    
    for i, item in enumerate(recent_wardrobe, 1):
        name = item.get('name', 'N/A')
        created = item.get('created_at', 'N/A')
        print(f"   {i}. Name: {name}, Created: {created}")
    
    # Test style trends queries
    print("\n--- STYLE TRENDS QUERIES ---")
    
    # Get analyses from last 6 months grouped by month
    six_months_ago = datetime.utcnow() - timedelta(days=180)
    
    pipeline = [
        {'$match': {
            'user_id': user_object_id,
            'created_at': {'$gte': six_months_ago}
        }},
        {'$group': {
            '_id': {
                'year': {'$year': '$created_at'},
                'month': {'$month': '$created_at'}
            },
            'avg_score': {'$avg': '$results.overallScore'},
            'count': {'$sum': 1}
        }},
        {'$sort': {'_id.year': 1, '_id.month': 1}}
    ]
    
    trend_data = list(db.analyses.aggregate(pipeline))
    print(f"✅ Style trends data points: {len(trend_data)}")
    
    for i, point in enumerate(trend_data, 1):
        year = point['_id']['year']
        month = point['_id']['month']
        avg_score = round(point['avg_score'], 1)
        count = point['count']
        print(f"   {i}. {year}-{month:02d}: Avg Score {avg_score}, Count {count}")
    
    # Summary
    print("\n=== SUMMARY ===")
    if total_analyses > 0:
        print("✅ Dashboard analytics will show real data!")
        print(f"   - {total_analyses} outfit analyses")
        print(f"   - {total_wardrobe_items} wardrobe items")
        print(f"   - Average style score: {avg_style_score}/10")
        
        if len(recent_analyses) > 0:
            print("✅ Recent activity will show real data!")
            
        if len(trend_data) > 0:
            print("✅ Style trends will show real data!")
        else:
            print("⚠️  No style trends data (analyses older than 6 months)")
    else:
        print("❌ Still no data - there may be another issue")
    
    client.close()

if __name__ == "__main__":
    try:
        test_dashboard_queries()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
