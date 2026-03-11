@echo off
echo ==============================================
echo    Starting ShopEZ E-commerce Application
echo ==============================================
echo.
echo Starting Backend Server on port 5000...
start cmd /k "cd backend && npm install && npm run dev"
echo.
echo Starting Frontend Development Server on port 3000...
start cmd /k "cd frontend && npm install && npm run dev"
echo.
echo Both servers are starting in separate windows.
echo You can now access the application at:
echo http://localhost:3000
echo.
