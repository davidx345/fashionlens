from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from bson import ObjectId
from models.analysis import Analysis
from models.wardrobe import WardrobeItem  
from models.user import User
from utils.db import get_db

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_dashboard_analytics():
    """Get dashboard analytics data for the current user"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        # Convert string user_id to ObjectId for database queries
        user_object_id = ObjectId(current_user_id)
        
        # Get user's analyses count
        total_analyses = db.analyses.count_documents({'user_id': user_object_id})
          # Get analyses from last month for trend calculation
        one_month_ago = datetime.utcnow() - timedelta(days=30)
        last_month_analyses = db.analyses.count_documents({
            'user_id': user_object_id,
            'created_at': {'$gte': one_month_ago}
        })
        
        # Calculate trend percentage for analyses
        if total_analyses > 0:
            analyses_trend = round((last_month_analyses / total_analyses) * 100, 1)
        else:
            analyses_trend = 0
        
        # Get wardrobe items count (note: collection is 'wardrobe_items' not 'wardrobe')
        total_wardrobe_items = db.wardrobe_items.count_documents({'user_id': user_object_id})
        
        # Get new wardrobe items from last month
        new_wardrobe_items = db.wardrobe_items.count_documents({
            'user_id': user_object_id,
            'created_at': {'$gte': one_month_ago}
        })
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
        
        # Get average score from last month for trend
        pipeline_last_month = [
            {'$match': {
                'user_id': user_object_id,
                'created_at': {'$gte': one_month_ago}
            }},
            {'$group': {
                '_id': None,
                'avg_score': {'$avg': '$results.overallScore'}
            }}
        ]
        last_month_score_result = list(db.analyses.aggregate(pipeline_last_month))
        last_month_avg_score = last_month_score_result[0]['avg_score'] if last_month_score_result else avg_style_score
        
        score_trend = round(last_month_avg_score - avg_style_score, 1) if avg_style_score > 0 else 0
        
        # Get recommendations viewed count (assuming we track this in user interactions)
        # For now, we'll use a placeholder based on analyses
        recommendations_viewed = total_analyses * 2  # Rough estimate
        recommendations_trend = round((last_month_analyses * 2 / max(recommendations_viewed, 1)) * 100, 1)
        
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
                'value': recommendations_viewed,
                'trend': f"+{recommendations_trend}%" if recommendations_trend > 0 else f"{recommendations_trend}%"
            },
            'styleScoreAverage': {
                'value': f"{avg_style_score}/10" if avg_style_score > 0 else "No data",
                'trend': f"+{score_trend}" if score_trend > 0 else f"{score_trend}"
            }
        }
        
        return jsonify(analytics_data), 200
        
    except Exception as e:
        print(f"Error getting dashboard analytics: {e}")
        return jsonify({'message': 'Failed to get dashboard analytics'}), 500

@dashboard_bp.route('/recent-activity', methods=['GET'])
@jwt_required()
def get_recent_activity():
    """Get recent user activity for dashboard"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        # Convert string user_id to ObjectId for database queries
        user_object_id = ObjectId(current_user_id)
        
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
                'type': 'analysis',
                'timestamp': analysis['created_at']
            })          # Get recent wardrobe additions (note: collection is 'wardrobe_items')
        recent_wardrobe = db.wardrobe_items.find({
            'user_id': user_object_id
        }).sort('created_at', -1).limit(2)
        
        for item in recent_wardrobe:
            time_diff = datetime.utcnow() - item['created_at']
            if time_diff.days > 0:
                time_str = f"{time_diff.days} day{'s' if time_diff.days > 1 else ''} ago"
            elif time_diff.seconds > 3600:
                hours = time_diff.seconds // 3600
                time_str = f"{hours} hour{'s' if hours > 1 else ''} ago"
            else:
                minutes = max(1, time_diff.seconds // 60)
                time_str = f"{minutes} minute{'s' if minutes > 1 else ''} ago"
            
            activities.append({
                'description': f"New item '{item.get('name', 'Unnamed item')}' added to wardrobe",
                'time': time_str,
                'type': 'wardrobe',
                'timestamp': item['created_at']
            })
        
        # Sort activities by timestamp (most recent first)
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        # Remove timestamp from response (we only needed it for sorting)
        for activity in activities:
            del activity['timestamp']
        
        return jsonify(activities[:5]), 200  # Return top 5 activities
        
    except Exception as e:
        print(f"Error getting recent activity: {e}")
        return jsonify({'message': 'Failed to get recent activity'}), 500

@dashboard_bp.route('/style-trends', methods=['GET'])
@jwt_required()
def get_style_trends():
    """Get style score trends over time for charts"""
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        
        # Convert string user_id to ObjectId for database queries
        user_object_id = ObjectId(current_user_id)
        
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
        
        # Format data for chart
        chart_data = []
        for item in trend_data:
            month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            month_name = month_names[item['_id']['month'] - 1]
            chart_data.append({
                'name': month_name,
                'score': round(item['avg_score'], 1),
                'count': item['count']
            })
        
        return jsonify(chart_data), 200
        
    except Exception as e:
        print(f"Error getting style trends: {e}")
        return jsonify({'message': 'Failed to get style trends'}), 500








# also use the session to make it so when a user is already logged in they will have an active session and if they close the tab for a short moment they will still be logged in or if the reload the page they will still be logged in because of the active session like all modern webapps