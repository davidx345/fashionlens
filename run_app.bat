@echo off
:: Fashion Analysis Application Launcher
:: This script starts both the backend Flask server and the frontend Next.js app

echo ===== Fashion Analysis Application =====
echo Starting the application components...

:: Create required directories
echo Setting up directories...
python setup_directories.py

:: Check MongoDB connection
echo Checking MongoDB connection...
python backend/test_db_connection.py
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo MongoDB connection issues detected.
    echo Please check your MongoDB Atlas credentials in the backend/.env file.
    echo.
    set /p fix_connection=Would you like to use local MongoDB instead? (y/n): 
    if /i "%fix_connection%"=="y" (
        echo Setting up local MongoDB connection...
        echo # Flask configuration > backend\.env.temp
        echo SECRET_KEY=your-secret-key-here >> backend\.env.temp
        echo PORT=5000 >> backend\.env.temp
        echo DEBUG=True >> backend\.env.temp
        echo. >> backend\.env.temp
        echo # MongoDB configuration >> backend\.env.temp
        echo MONGODB_URI=mongodb://localhost:27017/fashion_analysis >> backend\.env.temp
        echo. >> backend\.env.temp
        echo # Upload directory >> backend\.env.temp
        echo UPLOAD_FOLDER=uploads >> backend\.env.temp
        echo. >> backend\.env.temp
        echo # Google Gemini API >> backend\.env.temp
        echo GEMINI_API_KEY=AIzaSyDhHbE0wd4n0xYQn3e_pEVcxpFHwv-jBmQ >> backend\.env.temp
        
        move /y backend\.env.temp backend\.env
        echo Updated to use local MongoDB. Please make sure MongoDB is installed and running locally.
    ) else (
        pause
        exit /b 1
    )
)

:: Install backend dependencies if needed
if not exist "backend\venv" (
    echo Installing backend dependencies...
    cd backend
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    cd ..
)

:: Start the backend server in a new window
echo Starting backend server...
start "Fashion Analysis Backend" cmd /c "cd backend && call venv\Scripts\activate.bat && python run.py"

:: Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 10 /nobreak > nul

:: Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

:: Start the frontend in a new window
echo Starting frontend...
start "Fashion Analysis Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo Application components started!
echo.
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
echo Running health check in 10 seconds...
timeout /t 10 /nobreak > nul

:: Run health check
python health_check.py

echo.
echo Press any key to stop all application components...
pause > nul

:: Kill processes when user presses a key
echo Stopping application components...
taskkill /FI "WindowTitle eq Fashion Analysis Backend*" /T /F > nul 2>&1
taskkill /FI "WindowTitle eq Fashion Analysis Frontend*" /T /F > nul 2>&1

echo Application stopped.