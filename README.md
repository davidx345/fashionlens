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
- AI: Transformer models for image analysis