@echo off
echo ========================================
echo BeyondChats - Project Setup Checker
echo ========================================
echo.

echo [1/5] Checking Node.js...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/5] Checking Backend Dependencies...
cd backend
if exist node_modules (
    echo ✓ Backend dependencies installed
) else (
    echo Installing backend dependencies...
    call npm install
)
cd ..
echo.

echo [3/5] Checking Frontend Dependencies...
cd frontend
if exist node_modules (
    echo ✓ Frontend dependencies installed
) else (
    echo Installing frontend dependencies...
    call npm install
)
cd ..
echo.

echo [4/5] Checking Configuration...
if exist backend\.env (
    echo ✓ Backend .env file exists
) else (
    echo ERROR: backend\.env file not found!
    pause
    exit /b 1
)
echo.

echo [5/5] Setup Complete!
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Setup MongoDB Atlas (5 minutes):
echo    - See MONGODB_SETUP.md for instructions
echo    - Update backend\.env with connection string
echo.
echo 2. Start Backend (Terminal 1):
echo    cd backend
echo    npm start
echo.
echo 3. Scrape Articles (Terminal 2):
echo    cd backend
echo    npm run scrape
echo.
echo 4. Enhance Articles (Terminal 2):
echo    cd backend  
echo    npm run enhance
echo.
echo 5. Start Frontend (Terminal 3):
echo    cd frontend
echo    npm run dev
echo.
echo ========================================
echo.
pause
