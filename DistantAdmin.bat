@echo off
echo ============================================
echo 🚀 Starting Node.js, Flask, and React Projects
echo ============================================

:: === Node.js Backend ===
echo [1/3] Starting Node.js backend...
start cmd /k "cd /d D:\FirebaseListener && node index.js"

:: === Flask Backend ===
echo [2/3] Starting Flask backend...
start cmd /k "cd /d D:\flaskProjects\Visualizer-backend && call .venv\Scripts\activate && flask --app app.py run"

:: === React Frontend ===
echo [3/3] Starting React frontend...
start cmd /k "cd /d D:\Visualizer-frontend\visualizer && npm start"

echo ============================================
echo ✅ All projects started in separate terminals
echo ============================================
pause
