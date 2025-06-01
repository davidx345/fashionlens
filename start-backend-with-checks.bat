@echo off
echo ======================================
echo   FashionLens Backend Startup Check
echo ======================================
echo.

cd /d "C:\Users\xstat\OneDrive\Documents\Dev\webDev\fashionlens\backend"

echo 1. Checking if Python is available...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python.
    pause
    exit /b 1
)

echo.
echo 2. Checking if virtual environment exists...
if exist "venv" (
    echo Virtual environment found.
    call venv\Scripts\activate.bat
    echo Virtual environment activated.
) else (
    echo No virtual environment found. Creating one...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installing requirements...
    pip install -r requirements.txt
)

echo.
echo 3. Checking if .env file exists...
if exist ".env" (
    echo .env file found.
) else (
    echo WARNING: .env file not found. Creating from .env.example...
    if exist ".env.example" (
        copy .env.example .env
        echo Please edit .env file with your actual values.
    ) else (
        echo ERROR: .env.example not found either.
    )
)

echo.
echo 4. Starting Flask backend server...
echo Backend will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python run.py
