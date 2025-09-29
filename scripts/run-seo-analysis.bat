@echo off
echo.
echo 🔍 SEO Migration Progress Analyzer
echo ================================
echo.
echo Running SEO pipeline analysis...
echo.

cd /d "%~dp0.."
node scripts/seo-pipeline-analyzer.js

echo.
echo 📄 Report generated at: reports/seo-migration-report.md
echo 📊 JSON data available at: reports/seo-pipeline-analysis.json
echo.
pause