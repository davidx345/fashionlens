# 401 UNAUTHORIZED Error - Complete Fix Guide

## Problem Analysis
The outfit analyzer is getting 401 errors while the dashboard works fine. This indicates:
1. The backend may not be running
2. Authentication tokens may be missing or expired
3. The analysis endpoint may have different auth requirements

## Step-by-Step Solution

### Step 1: Start the Backend Properly
```bash
# Use the enhanced startup script
./start-backend-with-checks.bat
```

Or manually:
```bash
cd backend
python -m venv venv  # if venv doesn't exist
venv\Scripts\activate.bat
pip install -r requirements.txt
python run.py
```

### Step 2: Verify Backend is Running
Open a new terminal and test:
```bash
curl http://localhost:5000/api/dashboard/analytics
# Should return 401 (expected without auth)

# Test with proxy
curl http://localhost:3000/api/dashboard/analytics
# Should also return 401 but through Next.js proxy
```

### Step 3: Debug Authentication State
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run the debug script:
```javascript
// Copy contents of debug-auth.js and paste in console
```

### Step 4: Clear and Re-authenticate
If tokens are missing or expired:
```javascript
// Clear auth data
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
sessionStorage.clear();

// Reload page and login again
window.location.reload();
```

### Step 5: Verify API Endpoints
Check that these endpoints work in Network tab:
- ✅ `/api/dashboard/analytics` (working)
- ❌ `/api/analysis/upload` (failing)
- ❌ `/api/wardrobe` (failing)

### Step 6: Backend Authentication Check
Verify the analysis route has proper authentication:

```python
# In backend/routes/analysis.py
from flask_jwt_extended import jwt_required, get_jwt_identity

@analysis_bp.route('/upload', methods=['POST'])
@jwt_required()  # ← This should be present
def upload_analysis():
    current_user = get_jwt_identity()
    # ... rest of the function
```

## Root Cause Solutions

### If Backend Not Running:
- Use `start-backend-with-checks.bat`
- Check for port conflicts (kill any process on port 5000)
- Verify Python and dependencies are installed

### If Authentication Expired:
- Clear browser storage and re-login
- Check token expiration in debug output
- Verify refresh token mechanism works

### If API Endpoint Issues:
- Compare working dashboard service vs analysis service
- Ensure all protected routes have `@jwt_required()` decorator
- Check CORS configuration includes analysis endpoints

## Quick Test Commands

### Frontend (in browser console):
```javascript
// Test if authenticated
fetch('/api/dashboard/analytics').then(r => console.log('Status:', r.status));

// Test analysis endpoint
fetch('/api/analysis/history').then(r => console.log('Analysis:', r.status));
```

### Backend verification:
```bash
# Check if backend responds
curl -X GET http://localhost:5000/api/dashboard/analytics

# Check specific analysis endpoint
curl -X GET http://localhost:5000/api/analysis/history
```

## Expected Results
After fixes:
- ✅ Backend starts without errors
- ✅ Authentication tokens are present and valid
- ✅ Dashboard continues to work
- ✅ Outfit analyzer uploads work
- ✅ All protected endpoints return data (not 401)

## Files to Check
1. `backend/routes/analysis.py` - Ensure `@jwt_required()` decorators
2. `frontend/app/api/apiClient.ts` - Verify token injection
3. `frontend/.env.local` - Confirm `NEXT_PUBLIC_API_URL=/api`
4. Browser DevTools → Application → Local Storage - Check for tokens
