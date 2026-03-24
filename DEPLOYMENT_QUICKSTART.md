# OneConsensus Backend Deployment — Quick Start

## Status

✅ **Backend is ready to deploy.** Verified working locally with all endpoints.

**What you have:**
- FastAPI app with 15+ endpoints
- Dockerfile configured
- CORS enabled for Vercel frontend
- 3 AI agents (Claude, ChatGPT, Groq)
- Health check endpoint
- Full API documentation

---

## Deploy in 5 Minutes (Render.com)

### Step 1: Copy your API keys
```
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

### Step 2: Go to Render Dashboard
https://dashboard.render.com

### Step 3: Create New Web Service
- Click **"New +" → "Web Service"**
- Select: `LibruaryNFT/one-predict-arena`
- Authorize GitHub

### Step 4: Configure
- **Name**: `one-predict-arena-api`
- **Environment**: Python
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT`

### Step 5: Set Environment Variables
In the "Environment" section, add:
```
ANTHROPIC_API_KEY = <paste your key>
OPENAI_API_KEY = <paste your key>
GROQ_API_KEY = <paste your key>
```

### Step 6: Click "Create Web Service"
Render auto-deploys. Takes ~2 minutes.

---

## Your Live URL

```
https://one-predict-arena-api.onrender.com
```

Test it immediately:
```bash
curl https://one-predict-arena-api.onrender.com/health
```

---

## Update Your Vercel Frontend

Once backend is live, update the frontend .env:

```
VITE_API_BASE_URL=https://one-predict-arena-api.onrender.com
```

Then redeploy:
```bash
cd frontend
npm run build
vercel deploy --prod
```

---

## Test All Endpoints

```bash
# Health check
curl https://one-predict-arena-api.onrender.com/health

# List assets
curl https://one-predict-arena-api.onrender.com/api/assets

# Evaluate asset (MAIN ENDPOINT)
curl -X POST "https://one-predict-arena-api.onrender.com/api/evaluate?asset_id=medellin-tech-hub"

# View API docs (interactive)
# https://one-predict-arena-api.onrender.com/docs
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails with "No module" | Make sure Start Command has `cd backend &&` |
| 500 error "Missing API key" | Check env variables are set in Render dashboard |
| Slow first request | Normal on free tier (cold start). Second request is fast. |
| CORS error from frontend | Already configured — should work automatically |

---

## Other Options

- **Railway.app**: Free tier, easy GitHub integration
- **Local only**: Run `python -m uvicorn app:app --port 8000` in `backend/` folder
- **Docker locally**: `docker build -f backend/Dockerfile -t one-predict .`

See `DEPLOY.md` for details on all options.

---

## Why This Works

1. **Render picks up your Dockerfile** automatically
2. **Python 3.12 + FastAPI** is fully supported
3. **CORS configured** — frontend at any origin can call it
4. **Health checks** keep it from going to sleep
5. **Free tier** includes automatic HTTPS + unlimited requests

Next step: Go to Render dashboard and deploy! 🚀
