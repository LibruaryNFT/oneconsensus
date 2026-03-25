# OneConsensus

**AI Risk Intelligence for Tokenized Real-World Assets**

Three sovereign AI agents debate, analyze, and reach consensus on real-world asset risk — verified on OneChain.

## How It Works

1. **Pick an asset** — Real estate, commodities, agricultural property, renewable energy, maritime
2. **AI committee debates** — Auditor (yield-focused), Risk Officer (risk-focused), Arbitrator (balanced)
3. **Consensus reached** — Risk score, collateral ratio, valuation, recommendation
4. **Verified on OneChain** — Asset evaluation stored on-chain, integrated with OneRWA

## The 3 AI Agents

| Agent | Personality | Model | Focus |
|-------|-------------|-------|-------|
| **The Auditor** 📊 | Yield-Maximalist | Claude Opus | Growth opportunity, lower collateral requirements |
| **The Risk Officer** 🛡️ | Risk-Minimalist | GPT-4o-mini | Downside scenarios, higher collateral requirements |
| **The Arbitrator** ⚖️ | Balanced | Llama 3.1 70B | Synthesizes both, makes final call |

## Sample Assets

- **Medellin Tech Hub** — Commercial office building, $2.4M, 7.2% yield
- **Costa Rica Coffee Farm** — Agricultural land, $890K, 5.8% yield
- **Miami Beach Condo** — Residential property, $1.8M, 4.5% yield
- **Lagos Solar Farm** — Renewable energy, $3.2M, 9.1% yield
- **Singapore Cargo Ship** — Maritime freight, $12M, 11.3% yield
- **Dubai Gold Vault** — Commodity storage, $5.5M, 3.2% yield

## OneChain Integration

| Product | How It's Used |
|---------|---------------|
| **OneRWA** | Tokenized RWA registry — consensus feeds asset pool |
| **OneWallet** | Asset investor authentication + collateral deposit |
| **OnePredict** | Risk scores submitted to oracle for derivatives pricing |
| **OneID** | Investor identity verification for KYC |
| **OnePlay** | Leaderboard for top risk analysts (future) |

## Deployed on OneChain Testnet

**Live Contracts:**
- **Package ID:** `0x1f0b34d95db5859753f3aa7508055c5c049e33d313acf3585bf039cf22fb974e`
- **Modules:** leaderboard, prediction_pool, rewards
- **Network:** OneChain Testnet
- **TX Hash:** `7mmSkfmpzk4wXN3j5fgPms6KcUM1R8Md7wLFDvkLXdma`
- **Deployer:** `0xb379f5e673d9602fd9bc0b7e6d4b36dd5fdc4897ac7a44085961783196256409`

**Verify on-chain:**
- **Explorer:** [View on OneScan](https://onescan.cc/testnet/object/0x1f0b34d95db5859753f3aa7508055c5c049e33d313acf3585bf039cf22fb974e)
- **Check modules via RPC:**
  ```bash
  curl -X POST https://rpc.onechain.io/testnet \
    -H "Content-Type: application/json" \
    -d '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "sui_getObject",
      "params": ["0x1f0b34d95db5859753f3aa7508055c5c049e33d313acf3585bf039cf22fb974e"]
    }'
  ```

## Quick Start

### Backend (Local)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Add your API keys (ANTHROPIC_API_KEY, OPENAI_API_KEY, GROQ_API_KEY)
python -m uvicorn app:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

### Backend (Deploy to Render)

**One-click deployment via Render.com:**

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service" → Connect `LibruaryNFT/one-predict-arena` repo
3. **Build Command**: `pip install -r backend/requirements.txt`
4. **Start Command**: `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `ANTHROPIC_API_KEY` = your key
   - `OPENAI_API_KEY` = your key
   - `GROQ_API_KEY` = your key
6. Click "Create Web Service"

**Result**: Your backend URL will be `https://one-predict-arena-api.onrender.com` (free tier takes ~30s to start)

See [`DEPLOY.md`](./DEPLOY.md) for other deployment options (Railway, Heroku, local Docker).

### Frontend (Coming Soon)
```bash
cd frontend
npm install
VITE_API_BASE_URL=https://one-predict-arena-api.onrender.com npm run dev
# Update to your live backend URL once deployed
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│             INVESTOR / ANALYST                      │
│         (Web Interface or API Client)               │
└──────────────────┬──────────────────────────────────┘
                   │ REST API
┌──────────────────▼──────────────────────────────────┐
│            ONECONSENSUS BACKEND                     │
│  FastAPI (Python) - RWA Evaluation Engine           │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Auditor    │  │ Risk Officer│  │ Arbitrator  │ │
│  │  (Claude)   │  │  (GPT-4o)   │  │ (Llama)     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│       (Parallel Assessment)   (Consensus Synthesis) │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
    OneChain              RWA Registry
    (Asset Pool)          (Asset Catalog)
```

## Tech Stack

- **Smart Contracts**: Move (OneChain)
- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui (coming soon)
- **Backend**: FastAPI (Python), async consensus engine
- **AI Engines**: Claude Opus (Anthropic), GPT-4o-mini (OpenAI), Llama 3.1 (Groq)
- **Wallet**: OneWallet via @onelabs/dapp-kit

## API Endpoints

```
GET    /api/assets              # List all RWA assets
GET    /api/assets/{asset_id}   # Get asset details
POST   /api/evaluate            # Run consensus evaluation
GET    /api/agents              # List AI agents
GET    /health                  # Health check
```

## Quick Test

```bash
# List assets
curl http://localhost:8000/api/assets

# Get one asset
curl http://localhost:8000/api/assets/medellin-tech-hub

# Evaluate (THE MAIN ENDPOINT)
curl -X POST "http://localhost:8000/api/evaluate?asset_id=medellin-tech-hub"

# List agents
curl http://localhost:8000/api/agents
```

## Key Outputs

- **Risk Score** (1-100) — Combined asset risk assessment
- **Collateral Ratio** — How much collateral needed per $1 of value
- **Valuation** — Consensus estimate across all three agents
- **Debate Summary** — Where agents agreed/disagreed
- **Recommendation** — Strong Buy, Buy, Hold, Caution, Strong Caution

## License

MIT

## Hackathon

Built for [OneHack 3.0 | AI & GameFi Edition](https://dorahacks.io/hackathon/onehackathon) on DoraHacks.
