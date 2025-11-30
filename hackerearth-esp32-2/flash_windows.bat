@ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION
setlocal
REM go to the folder where this bat script is located
cd /d %~dp0

where /q python
IF ERRORLEVEL 1 (
    GOTO PYTHONNOTINPATHERROR
)

echo If you see a ModuleNotFoundError error, run the following commands to add Python packages
echo      python -m pip install pyserial^>=3.4
echo      python -m pip install esptool^>=3.3
echo .

python -m esptool -b 460800 write_flash 0x0 firmware_esp32.bin

echo .
echo Flashed your ESP32 development board.
echo To set up your development with Edge Impulse, run 'edge-impulse-daemon'
echo To run your impulse on your development board, run 'edge-impulse-run-impulse'

@pause
exit /b 0

:PYTHONNOTINPATHERROR
echo Cannot find 'python' in your PATH. Install Python 3 before you continue
echo Installation instructions: https://www.python.org/downloads/
@pause
exit /b 1
