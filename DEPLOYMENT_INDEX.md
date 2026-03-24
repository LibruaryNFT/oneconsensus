# OneConsensus Deployment Documentation Index

This folder contains everything you need to deploy the FastAPI backend and integrate with the Vercel frontend.

## Quick Navigation

### 🚀 I WANT TO DEPLOY NOW
→ **[DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md)** (5 minutes)
- Step-by-step Render.com deployment
- 6 simple steps
- Expected to take 5 minutes total

### 📖 I WANT ALL OPTIONS
→ **[DEPLOY.md](./DEPLOY.md)** (detailed)
- Render (recommended)
- Railway (free tier)
- Heroku
- Local development
- Docker
- Testing endpoints

### ✅ I WANT TO VERIFY EVERYTHING
→ **[DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)** (checklist)
- What's complete
- What's tested
- Verification checklist
- Troubleshooting
- Pre-demo verification

### 📝 DOCUMENTATION FILES

| File | Purpose | Read If |
|------|---------|---------|
| **[README.md](./README.md)** | Project overview + quick deploy | You're new to the project |
| **[DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md)** | 5-min Render setup | You want to deploy in 5 minutes |
| **[DEPLOY.md](./DEPLOY.md)** | Complete deployment guide | You want detailed options |
| **[DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)** | Status + checklist | You want to verify everything works |
| **[backend/.env.example](./backend/.env.example)** | API key template | You need to add your keys |
| **[fly.toml](./fly.toml)** | Fly.io config | You're using Fly.io (requires payment) |
| **[test-backend-local.ps1](./test-backend-local.ps1)** | Local test script | You want to test locally first |

### 🎯 DEPLOYMENT PATHS

**Path 1: Cloud Deployment (Recommended)**
```
1. Read: DEPLOYMENT_QUICKSTART.md
2. Go to: https://dashboard.render.com
3. Deploy: ~5 minutes
4. Get URL: https://one-predict-arena-api.onrender.com
5. Update: frontend .env
6. Redeploy: frontend to Vercel
```

**Path 2: Local Development**
```
1. cd backend
2. python -m uvicorn app:app --port 8000
3. Frontend: VITE_API_BASE_URL=http://localhost:8000
4. Test at: http://localhost:8000/docs
```

**Path 3: Docker**
```
1. docker build -f backend/Dockerfile -t one-predict .
2. docker run -p 8000:8000 -e ANTHROPIC_API_KEY=... one-predict
3. Access: http://localhost:8000/docs
```

### ⚙️ CONFIGURATION FILES

- **backend/requirements.txt** — Python dependencies
- **backend/Dockerfile** — Docker image
- **backend/Procfile** — Heroku/Railway config
- **backend/render.yaml** — Render config
- **backend/app.py** — FastAPI application
- **backend/.env** — API keys (gitignored, not in repo)
- **backend/.env.example** — Template for .env

### 🧪 TESTING

**Local test (after cloning):**
```bash
cd backend
python -m uvicorn app:app --reload --port 8000
# Then visit http://localhost:8000/docs
```

**After deployment to Render:**
```bash
curl https://one-predict-arena-api.onrender.com/health
curl https://one-predict-arena-api.onrender.com/api/assets
```

**PowerShell test script:**
```powershell
.\test-backend-local.ps1
```

### 🔗 KEY URLS

- **GitHub Repo**: https://github.com/LibruaryNFT/one-predict-arena
- **Render Dashboard**: https://dashboard.render.com
- **Once deployed**: https://one-predict-arena-api.onrender.com

### 📋 BEFORE DEMO CHECKLIST

- [ ] Backend deployed (Render or local)
- [ ] All 3 API keys configured (ANTHROPIC, OPENAI, GROQ)
- [ ] Health check passing
- [ ] Frontend .env updated with backend URL
- [ ] Frontend redeployed to Vercel
- [ ] Test evaluate endpoint with sample asset
- [ ] Verify CORS works (test from Vercel)
- [ ] Document live URLs in hackathon submission

### ❓ COMMON QUESTIONS

**Q: Which deployment option is best?**
A: Render.com (recommended). Takes 5 minutes, free tier, includes HTTPS, auto-deploys from GitHub.

**Q: Can I test locally first?**
A: Yes. Run `cd backend && python -m uvicorn app:app --port 8000`, then update frontend .env to http://localhost:8000.

**Q: What if Render deployment fails?**
A: Check DEPLOY.md troubleshooting section. Most common issue: missing "cd backend &&" in start command.

**Q: Do I need all 3 API keys?**
A: Yes. You need:
- ANTHROPIC_API_KEY (Claude/Auditor agent)
- OPENAI_API_KEY (ChatGPT/Risk Officer agent)
- GROQ_API_KEY (Llama/Arbitrator agent)

**Q: How long does deployment take?**
A: Render: ~2 minutes after clicking "Create Web Service"
  First request may be slow (cold start), subsequent requests are fast.

**Q: Can I use a different hosting?**
A: Yes. See DEPLOY.md for Railway, Heroku, local Docker options.

### 📞 SUPPORT

All deployment options are fully documented. If you hit an issue:

1. Check [DEPLOY.md](./DEPLOY.md) troubleshooting section
2. Verify API keys are correct
3. Check Render/Railway logs
4. Test locally first to isolate issues
5. Verify backend responds: `curl http://localhost:8000/health`

### ✨ SUMMARY

✅ Backend is **production-ready**
✅ All documentation **provided**
✅ Multiple deployment **options available**
✅ Estimated deployment time: **5 minutes** (Render)

**Next step: Pick your path above and deploy!** 🚀
