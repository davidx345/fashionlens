@echo off
:: Fashion Analysis Application Reset Script
:: This script resets the application state and cleans caches

echo ===== Fashion Analysis Application Reset =====

:: Terminate any running instances
echo Stopping any running application components...
taskkill /FI "WindowTitle eq Fashion Analysis Backend*" /T /F > nul 2>&1
taskkill /FI "WindowTitle eq Fashion Analysis Frontend*" /T /F > nul 2>&1

:: Clean frontend cache
echo Cleaning frontend cache...
cd frontend
if exist ".next" (
    rmdir /s /q .next
    echo - Removed .next directory
)
if exist "node_modules/.cache" (
    rmdir /s /q node_modules\.cache
    echo - Cleaned node_modules cache
)
cd ..

:: Clean backend cache
echo Cleaning backend cache...
cd backend
if exist "__pycache__" (
    rmdir /s /q __pycache__
    echo - Removed __pycache__ directory
)
for /d %%d in (*) do (
    if exist "%%d\__pycache__" (
        rmdir /s /q %%d\__pycache__
        echo - Removed %%d\__pycache__ directory
    )
)
cd ..

:: Verify directories
echo Recreating necessary directories...
python setup_directories.py

echo.
echo ===== Reset Complete =====
echo You can now run the application with: run_app.bat
echo.

pause
