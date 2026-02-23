@echo off
REM Quick script to create insurer directories for two-wheeler PDFs

cd /d "e:\Rexi -Legal\e--orchids-projects-orchids-lexi-contract-analysis\knowledge-base\motor-vehicle-insurance\samples\two-wheeler"

echo Creating insurer directories...

mkdir icici-lombard 2>nul
mkdir bajaj-allianz 2>nul
mkdir hdfc-ergo 2>nul
mkdir digit 2>nul
mkdir acko 2>nul
mkdir future-generali 2>nul
mkdir royal-sundaram 2>nul
mkdir other 2>nul

echo.
echo Done! Directories created:
echo.
echo   icici-lombard/
echo   bajaj-allianz/
echo   hdfc-ergo/
echo   digit/
echo   acko/
echo   future-generali/
echo   royal-sundaram/
echo   other/
echo.
echo Next steps:
echo 1. Copy your PDF files into the appropriate insurer folders
echo 2. Run: npx tsx scripts\analyze-bike-pdfs.ts
echo.
pause
