@echo off
echo Stopping any running Next.js processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting Next.js development server...
cd /d "C:\Users\xstat\OneDrive\Documents\Dev\webDev\fashionlens\frontend"
npm run dev
