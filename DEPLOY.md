# OneConsensus Backend Deployment Guide

## Quick Summary

The FastAPI backend is ready to deploy. This guide covers multiple deployment options.

## Pre-Deployment Checklist

- [x] Dockerfile present and valid (`backend/Dockerfile`)
- [x] FastAPI app configured with CORS for Vercel frontend
- [x] Health endpoint implemented (`/health`, `/api/health`)
- [x] Requirements.txt with all dependencies
- [x] Environment variables needed:
  - `ANTHROPIC_API_KEY` — Claude API key for one agent
  - `OPENAI_API_KEY` — ChatGPT API key for another agent
  - `GROQ_API_KEY` — Groq API key for third agent

---

## Option 1: Render.com (Recommended for Hackathon)

### Steps

1. **Push code to GitHub** (already done: `LibruaryNFT/one-predict-arena`)

2. **Go to Render dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repo: `LibruaryNFT/one-predict-arena`
   - Select repo and authorize

3. **Configure deployment**
   - **Name**: `one-predict-arena-api`
   - **Runtime**: Python 3.12
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: (leave empty, Render finds Dockerfile)
   - **Plan**: Free (or Starter for guaranteed uptime)

4. **Set environment variables**
   - In Render dashboard, go to Environment
   - Add three environment variables:
     - `ANTHROPIC_API_KEY` = your key
     - `OPENAI_API_KEY` = your key
     - `GROQ_API_KEY` = your key

5. **Deploy**
   - Click "Create Web Service"
   - Render auto-deploys on every push to `main`

### Expected URL
```
https://one-predict-arena-api.onrender.com
```

### Health Check
Once deployed, verify:
```bash
curl https://one-predict-arena-api.onrender.com/health
# Response: {"status": "ok", "service": "OneConsensus - RWA Risk Assessment Platform"}
```

---

## Option 2: Railway.app (Free Tier Available)

### Steps

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and initialize**
   ```bash
   railway login
   cd /c/Code/one-predict-arena
   railway init
   ```

3. **Configure**
   - Select "Python" as template
   - Set build command: `pip install -r backend/requirements.txt`
   - Set start command: `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT`

4. **Set secrets**
   ```bash
   railway variables set ANTHROPIC_API_KEY=<your-key>
   railway variables set OPENAI_API_KEY=<your-key>
   railway variables set GROQ_API_KEY=<your-key>
   ```

5. **Deploy**
   ```bash
   railway up
   ```

---

## Option 3: Local Development + Frontend Proxy

For testing without live deployment:

1. **Run backend locally**
   ```bash
   cd c:/Code/one-predict-arena/backend
   python -m pip install -r requirements.txt
   python -m uvicorn app:app --reload --port 8000
   ```

2. **Backend runs at** `http://localhost:8000`

3. **Update frontend .env**
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Frontend in dev mode**
   ```bash
   cd c:/Code/one-predict-arena/frontend
   npm run dev
   ```

5. **Access at** `http://localhost:5173`

---

## Option 4: Dockerfile + Docker Compose (Local Testing)

```bash
cd /c/Code/one-predict-arena

# Build image
docker build -f backend/Dockerfile -t one-predict-arena-api:latest .

# Run container
docker run -p 8000:8000 \
  -e ANTHROPIC_API_KEY=$env:ANTHROPIC_API_KEY \
  -e OPENAI_API_KEY=$env:OPENAI_API_KEY \
  -e GROQ_API_KEY=$env:GROQ_API_KEY \
  one-predict-arena-api:latest
```

---

## Configuration for Vercel Frontend

Once backend is deployed at `https://one-predict-arena-api.onrender.com`, update the frontend:

### Frontend .env.local
```
VITE_API_BASE_URL=https://one-predict-arena-api.onrender.com
```

### Rebuild & deploy frontend
```bash
cd frontend
npm run build
vercel deploy --prod
```

---

## Testing All Endpoints

Once deployed, test with:

```bash
# Health check
curl https://one-predict-arena-api.onrender.com/health

# List RWA assets
curl https://one-predict-arena-api.onrender.com/api/assets

# Get single asset
curl https://one-predict-arena-api.onrender.com/api/assets/RWA-001

# Evaluate asset (consensus)
curl -X POST https://one-predict-arena-api.onrender.com/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{"asset_id": "RWA-001"}'

# Create a battle
curl -X POST https://one-predict-arena-api.onrender.com/api/battles \
  -H "Content-Type: application/json" \
  -d '{"asset_a": "RWA-001", "asset_b": "RWA-002"}'

# List available agents
curl https://one-predict-arena-api.onrender.com/api/agents
```

---

## Troubleshooting

### Build fails: "No module named 'app'"
- **Cause**: Build command doesn't CD into backend/
- **Fix**: Use `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT`

### 500 Error: "Missing API key"
- **Cause**: Environment variables not set in deployment platform
- **Fix**: Add all three API keys to platform's environment section

### CORS error in frontend
- **Already fixed**: Backend includes CORS headers for all origins

### Slow startup / timeouts
- **Normal on free tier**: First request may take 30-60 seconds (cold start)
- **Solution**: Keep-alive pings or upgrade to paid tier

---

## Production Checklist

Before live demo:
- [ ] Backend deployed and health check passing
- [ ] All 3 API keys configured (ANTHROPIC, OPENAI, GROQ)
- [ ] Frontend points to correct backend URL
- [ ] CORS working (test from browser console)
- [ ] Test all main flows: evaluate, battle, consensus
- [ ] Check logs for errors
- [ ] Keep browser DevTools open to catch any client-side issues
