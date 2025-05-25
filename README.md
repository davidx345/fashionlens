# Fashion Analysis Application

A full-stack application for AI-powered fashion analysis, wardrobe management, and style recommendations.

> **Latest Update (May 23, 2025)**: Fixed frontend-backend integration issues and improved image handling!

## Features

- **Outfit Analysis**: Upload photos of your outfits for instant AI-powered analysis
- **Style Scoring**: Get objective ratings on color harmony, fit, and overall style
- **Wardrobe Management**: Digitize and organize your clothing collection
- **Style Recommendations**: Receive personalized outfit and style suggestions
- **Responsive Design**: Modern UI that works on all devices

## Technology Stack

### Frontend
- Next.js 14+ with App Router
- React and TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- Axios for API requests

### Backend
- Flask (Python) API server
- MongoDB Atlas for data storage
- Google Gemini API for AI analysis
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas account (or local MongoDB server)
- Google Gemini API key (for AI analysis)

### Backend Setup
1. Navigate to the `backend` directory
2. Copy `.env.example` to `.env` and configure your settings
3. Create a virtual environment: `python -m venv venv`
4. Activate the environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
5. Install dependencies: `pip install -r requirements.txt`
6. Run the server: `python run.py`

### Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and configure your settings
4. Run the development server: `npm run dev`

### Quick Start
For Windows users, you can simply run `run_app.bat` to start both frontend and backend.

## Project Structure

- `/backend`: Flask server code
  - `/routes`: API endpoints
  - `/models`: Database models
  - `/ai`: AI analysis components
  - `/utils`: Helper utilities
  - `/uploads`: Storage for uploaded images

- `/frontend`: Next.js application
  - `/app`: Next.js app router pages
  - `/components`: Reusable UI components
  - `/api/services`: API service functions
  - `/public`: Static assets

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in and get access token

### Analysis
- `POST /api/analysis/upload`: Upload image for analysis
- `GET /api/analysis/:id`: Get specific analysis by ID
- `GET /api/analysis/history`: Get analysis history

### Wardrobe
- `GET /api/wardrobe`: Get user's wardrobe items
- `POST /api/wardrobe`: Add new item to wardrobe
- `PUT /api/wardrobe/:id`: Update wardrobe item
- `DELETE /api/wardrobe/:id`: Remove item from wardrobe

### Recommendations
- `GET /api/recommendations`: Get style recommendations
- `GET /api/recommendations/outfits`: Get outfit recommendations
