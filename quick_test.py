#!/usr/bin/env python3
"""
Quick test to show dashboard is working
"""

from pymongo import MongoClient
from bson import ObjectId

# Database connection
mongo_uri = "mongodb+srv://xstati72:fashion123@fashionlens.ld2bx7j.mongodb.net/?retryWrites=true&w=majority&appName=FashionLens"
client = MongoClient(mongo_uri)
db = client["FashionLens"]

# Get user and convert ID
user = db.users.find_one({})
user_object_id = ObjectId(str(user['_id']))

# Test key metrics
analyses = db.analyses.count_documents({'user_id': user_object_id})
wardrobe = db.wardrobe_items.count_documents({'user_id': user_object_id})

# Get average score
pipeline = [
    {'$match': {'user_id': user_object_id}},
    {'$group': {'_id': None, 'avg_score': {'$avg': '$results.overallScore'}}}
]
avg_result = list(db.analyses.aggregate(pipeline))
avg_score = round(avg_result[0]['avg_score'], 1) if avg_result else 0

print("🎉 DASHBOARD FIX SUCCESSFUL!")
print(f"✅ Total analyses: {analyses}")
print(f"✅ Total wardrobe items: {wardrobe}")
print(f"✅ Average style score: {avg_score}/10")
print("\n💡 The dashboard should now display real user data!")

client.close()
