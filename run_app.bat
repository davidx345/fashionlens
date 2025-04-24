REM filepath: c:\Users\david\Documents\fashion\run_app.bat
@echo off
echo Checking MongoDB connection...
python backend/scripts/check_db.py
IF %ERRORLEVEL% NEQ 0 (
    echo MongoDB connection failed! Please ensure MongoDB is running.
    exit /b 1
)

echo Initializing MongoDB...
python backend/scripts/init_db.py

echo Starting backend server...
start cmd /k "cd backend; python app.py"

echo Starting frontend...
start cmd /k "cd frontend; npm start"