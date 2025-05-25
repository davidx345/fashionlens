# Troubleshooting Guide for Fashion Analysis Application

This document provides solutions for common issues you might encounter when setting up or running the Fashion Analysis application.

## Frontend UI Issues

### Issue: "Frontend Has Basic/Plain UI Instead of Modern Design"

**Symptoms:**
- The application shows a very basic dark-themed UI instead of the modern card-based design
- Missing styling or components
- Long loading times (e.g., "GET / 200 in 222007ms")

**Solutions:**
1. **Clear Next.js Cache**:
   ```powershell
   cd frontend
   npm run clean        # Add this script to package.json
   rm -r -fo .next      # Or manually remove the .next directory
   npm run dev
   ```

2. **Check CSS Loading**:
   - Ensure `globals.css` is properly imported in `layout.tsx`
   - Verify that Tailwind CSS directives are present in CSS files

3. **Fix Image Loading Issues**:
   - Ensure placeholder images exist in the `public` directory
   - Use relative paths without query parameters (`/placeholder.svg` instead of `/placeholder.svg?height=500&width=500`)
   - Use the SafeImage component for more reliable image rendering

4. **Development Server Performance**:
   - Remove `--turbopack` flag from the dev script if it's causing issues
   - Try running with limited concurrency: `npm run dev -- --turbo`

## MongoDB Connection Issues

### Issue: "MongoDB Authentication Failed"

**Symptoms:**
- `test_db_connection.py` returns authentication failed
- Backend fails to start with MongoDB-related errors

**Solutions:**
1. **Check your MongoDB URI**:
   - Ensure the username and password in your `backend/.env` file are correct
   - Make sure the connection string format is correct: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>`

2. **IP Whitelist**:
   - Verify your current IP address is whitelisted in MongoDB Atlas
   - Go to MongoDB Atlas → Network Access → Add IP Address → Add Current IP Address

3. **Create a New User**:
   - If authentication continues to fail, create a new database user in MongoDB Atlas
   - MongoDB Atlas → Database Access → Add New Database User

## Backend Server Issues

### Issue: "Backend Server Won't Start"

**Symptoms:**
- Error when running `python run.py` in the backend directory
- Missing dependencies or module import errors

**Solutions:**
1. **Python Environment**:
   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   - Ensure `backend/.env` file exists and has all required variables
   - Check that the MongoDB URI and other credentials are correct

3. **Port Already in Use**:
   - If port 5000 is already in use, change it in `backend/.env`:
   ```
   FLASK_RUN_PORT=5001
   ```

## Frontend Issues

### Issue: "API Connection Failed"

**Symptoms:**
- Frontend loads but shows API errors in the browser console
- Cannot log in or data doesn't load

**Solutions:**
1. **API URL Configuration**:
   - Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local` points to the correct API URL
   - For local development, it should be `http://localhost:5000/api`

2. **CORS Issues**:
   - If seeing CORS errors, ensure the backend CORS configuration is correct
   - The backend should allow requests from the frontend origin

3. **JWT Token Issues**:
   - Clear localStorage in browser dev tools
   - Log out and log back in

### Issue: "Next.js Build Errors"

**Symptoms:**
- Build or development server fails to start
- TypeScript errors

**Solutions:**
1. **Dependency Issues**:
   ```powershell
   cd frontend
   npm install
   ```

2. **Next.js Cache**:
   ```powershell
   cd frontend
   npm run dev -- --turbo
   ```

## Image Upload Issues

### Issue: "Image Upload Fails"

**Symptoms:**
- Cannot upload images in the analyze outfit page
- Backend errors when uploading files

**Solutions:**
1. **Directory Permissions**:
   - Run `python setup_directories.py` to create needed directories
   - Ensure the `uploads` directory exists and is writable

2. **File Size**:
   - Check if the image file size exceeds the limit (default 16MB)
   - Resize or compress images before uploading

3. **Content Type**:
   - Ensure the frontend sends the correct Content-Type header for multipart/form-data

## AI Analysis Issues

### Issue: "AI Analysis Returns Generic Results"

**Symptoms:**
- Analysis results seem generic or not specific to the outfit
- Missing API key warnings in logs

**Solutions:**
1. **Google Gemini API Key**:
   - Ensure you have set up your Gemini API key in `backend/.env`
   - If missing, the application will fall back to mock data

2. **Image Quality**:
   - Ensure uploaded images are clear and well-lit
   - The full outfit should be visible in the image

## General Troubleshooting Steps

1. **Run Health Check**:
   ```powershell
   python health_check.py
   ```

2. **Check Logs**:
   - Review backend logs for Python errors
   - Check browser console for frontend errors

3. **Restart Services**:
   - Stop and restart both frontend and backend services
   - Run the `run_app.bat` script to restart everything
