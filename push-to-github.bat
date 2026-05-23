@echo off
echo ========================================
echo  Pushing upload fix (Uint8Array)...
echo ========================================
cd /d "C:\Users\ITadmin\resume-next"

del /f .git\index.lock 2>nul
git remote set-url origin https://github.com/ariff2006/resume-next.git

git add src/app/api/upload/route.ts
git commit -m "Fix: use Uint8Array instead of Buffer for Supabase Storage upload"
git push origin main

echo ========================================
if %ERRORLEVEL% == 0 (
    echo  SUCCESS! Deploy in ~2 minutes.
    echo  Test upload at resume-next-blond.vercel.app/admin
) else (
    echo  ERROR: Push failed.
)
echo ========================================
pause
