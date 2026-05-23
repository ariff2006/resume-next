@echo off
echo ========================================
echo  Fixing missing packages and pushing...
echo ========================================
cd /d "C:\Users\ITadmin\resume-next"

echo [1/4] Removing git lock file...
del /f .git\index.lock 2>nul

echo [2/4] Staging changed files...
git add package.json package-lock.json
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git add failed!
    pause
    exit /b 1
)

echo [3/4] Committing fix...
git commit -m "Fix: add clsx and tailwind-merge dependencies"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git commit failed!
    pause
    exit /b 1
)

echo [4/4] Pushing to GitHub...
git push origin main
echo ========================================
if %ERRORLEVEL% == 0 (
    echo  SUCCESS! Vercel will deploy in ~2 minutes.
    echo  Test saving at resume-next-blond.vercel.app/admin
) else (
    echo  ERROR: Push failed.
)
echo ========================================
pause
