# Fashion Analysis Application

An AI-powered fashion analysis tool built with Flask, React, and MongoDB.

## Project Structure
```
fashion/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models/
│   ├── services/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── docker-compose.yml
```

## Prerequisites
- Docker
- Docker Compose

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fashion
```

2. Build and start the containers:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Environment Variables
Create a `.env` file in the root directory with:
```
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DB=fashionlens
```

## Tech Stack
- Backend: Flask (Python)
- Frontend: React
- Database: MongoDB
- AI: Google Gemini API for image and text analysis

## Features

- **Outfit Analysis**: Get detailed feedback on your outfits including style classification, color harmony, fit analysis, and ratings
- **User Accounts**: Create an account to save your analysis history and build your virtual wardrobe
- **Personalized Recommendations**: Receive outfit recommendations based on your wardrobe items
- **Body Shape Analysis**: Get style advice based on your body shape
- **Fabric & Brand Recognition**: Identify fabric types and possible brands from your clothing items
- **Multiple Angle Analysis**: Upload multiple images for more comprehensive outfit analysis
- **Seasonal Suggestions**: Get outfit suggestions based on the current season

## Environment Variables Setup

Create a `.env` file in the root directory with:
```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=fashionlens

# JWT Secret
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production

# Gemini API - Replace with your actual API key
GEMINI_API_KEY=your-gemini-api-key-here

# Google Calendar Integration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Development Setup (without Docker)

1. Create and activate a virtual environment:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. Install dependencies:
```powershell
pip install -r requirements.txt
```

3. Start the backend server:
```powershell
python -m backend.app
```

4. In a separate terminal, set up the frontend:
```powershell
cd frontend
npm install
npm start
```