@echo off
echo ========================================
echo    Restarting DeepShield AI Bot
echo ========================================
echo.
echo Stopping any running bot processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im py.exe 2>nul
echo.
echo Starting bot with username: @deepshield_ai_bot
echo.
py telegram_bot.py
pause 