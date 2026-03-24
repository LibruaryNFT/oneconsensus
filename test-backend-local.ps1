# Quick local backend test script
# Usage: powershell -ExecutionPolicy Bypass -File test-backend-local.ps1

Write-Host "=== OneConsensus Backend Local Test ===" -ForegroundColor Cyan

# 1. Check if backend/.env exists
if (-not (Test-Path "backend/.env")) {
    Write-Host "❌ backend/.env not found" -ForegroundColor Red
    Write-Host "   Copy backend/.env.example to backend/.env and add your API keys" -ForegroundColor Yellow
    exit 1
}

# 2. Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Blue
Set-Location backend
python -m pip install -q -r requirements.txt

# 3. Start server in background
Write-Host "`n🚀 Starting FastAPI server..." -ForegroundColor Blue
$process = Start-Process python -ArgumentList "-m uvicorn app:app --reload --port 8000" -NoNewWindow -PassThru

# Wait for server to start
Start-Sleep -Seconds 3

# 4. Test health endpoint
Write-Host "`n🔍 Testing /health endpoint..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -ErrorAction Stop
    Write-Host "✅ Health check passed:" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    Stop-Process -Id $process.Id
    exit 1
}

# 5. Test /api/assets endpoint
Write-Host "`n🔍 Testing /api/assets endpoint..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/assets" -ErrorAction Stop
    Write-Host "✅ Assets endpoint working" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Found $($data.Count) sample assets"
} catch {
    Write-Host "❌ Assets endpoint failed: $_" -ForegroundColor Red
}

Write-Host "`n✅ Backend is running on http://localhost:8000" -ForegroundColor Green
Write-Host "   Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   API Reference: http://localhost:8000/openapi.json" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Yellow

# Keep process alive
$process | Wait-Process
