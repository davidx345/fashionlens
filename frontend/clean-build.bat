@echo off
echo Cleaning Next.js cache and rebuilding...
cd /d "c:\Users\xstat\OneDrive\Documents\Dev\webDev\fashionlens\frontend"

echo Removing .next directory...
if exist ".next" rmdir /s /q ".next"

echo Removing node_modules cache...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"

echo Running npm install to ensure dependencies are up to date...
npm install

echo Building the application...
npm run build

echo Build complete!
pause
