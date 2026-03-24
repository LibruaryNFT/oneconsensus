# OneConsensus — Backend API

AI-powered RWA risk assessment. Three AI agents debate and reach consensus on asset risk, collateral ratios, and valuations.

**Agents:**
- **The Auditor** (Claude Opus) — Yield-focused, growth-oriented
- **The Risk Officer** (GPT-4o-mini) — Risk-focused, prudent
- **The Arbitrator** (Llama 3.1 70B) — Balanced synthesis

## Status: FULLY FUNCTIONAL ✓

All core RWA evaluation endpoints are tested and working end-to-end with real AI consensus and live asset catalog.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup API Keys

Copy API keys to `.env` file (from `<eco-root>/.env`):

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-...
GROQ_API_KEY=gsk_...
PORT=8000
ENV=development
```

Note: Do NOT commit `.env` file (already in .gitignore).

### 3. Run the Server

```bash
python app.py
```

Server available at: **http://localhost:8000**

## Core Concept: The AI Committee

Three financial analysts with different perspectives evaluate each RWA:

| Agent | Personality | Focus | Model |
|-------|-------------|-------|-------|
| **The Auditor** | Yield-Focused | Identifies opportunity, growth potential, lower collateral | Claude Opus 4 |
| **The Risk Officer** | Risk-Focused | Identifies risks, downside scenarios, higher collateral | GPT-4o-mini |
| **The Arbitrator** | Balanced | Synthesizes both views, makes final call | Llama 3.1 70B |

**Flow**: Auditor + Risk Officer assess in parallel → Arbitrator reads both → Final consensus recommendation.

## API Endpoints

### 1. List Assets
```
GET /api/assets
```

Response:
```json
{
  "total": 6,
  "assets": [
    {
      "id": "medellin-tech-hub",
      "name": "Medellin Tech Hub",
      "asset_type": "Commercial Real Estate",
      "location": "Medellin, Colombia",
      "estimated_value": 2400000,
      "yield_rate": 7.2,
      "description": "Modern 12,000 sqft commercial office building..."
    },
    ...
  ]
}
```

### 2. Get Asset Details
```
GET /api/assets/{asset_id}
```

Example: `GET /api/assets/medellin-tech-hub`

Returns full RWAAsset with description and risk factors.

### 3. Evaluate Asset (THE MAIN ENDPOINT)
```
POST /api/evaluate?asset_id={asset_id}
```

This triggers the three-agent consensus evaluation. Response:

```json
{
  "asset": {
    "id": "medellin-tech-hub",
    "name": "Medellin Tech Hub",
    "asset_type": "Commercial Real Estate",
    ...
  },
  "assessments": [
    {
      "agent_name": "The Auditor",
      "risk_score": 32,
      "collateral_ratio": 112.5,
      "valuation": 2520000,
      "reasoning": "This commercial property in Medellin's tech hub presents compelling yield potential...",
      "risks": ["Currency volatility", "Regulatory changes", ...],
      "opportunities": ["Strong tenant occupancy", "Inflation-linked rent", ...]
    },
    {
      "agent_name": "The Risk Officer",
      "risk_score": 58,
      "collateral_ratio": 145.0,
      "valuation": 2280000,
      "reasoning": "While the yield is attractive, we must consider geopolitical and regulatory risks...",
      "risks": ["Political instability", "Tax policy changes", ...],
      "opportunities": ["Long-term leases", "Diversification", ...]
    },
    {
      "agent_name": "The Arbitrator",
      "risk_score": 45,
      "collateral_ratio": 128.0,
      "valuation": 2400000,
      "reasoning": "Balancing the Auditor's optimism with the Risk Officer's caution...",
      "risks": [],
      "opportunities": []
    }
  ],
  "final_risk_score": 45.0,
  "final_collateral_ratio": 128.0,
  "final_valuation": 2400000,
  "consensus_reasoning": "The Arbitrator's synthesis of both perspectives...",
  "debate_summary": "The Auditor and Risk Officer disagreed on collateral requirements...",
  "recommendation": "Buy"
}
```

### 4. List Agents
```
GET /api/agents
```

Returns information about the three AI agents and their roles.

### 5. Health Check
```
GET /health
GET /api/health
```

Response: `{"status":"ok","service":"OneConsensus - RWA Risk Assessment Platform"}`

## Sample Assets

Six demo RWA assets included:

1. **Medellin Tech Hub** — Commercial office building, $2.4M, 7.2% yield
2. **Costa Rica Coffee Farm** — Agricultural land, $890K, 5.8% yield
3. **Miami Beach Condo** — Residential property, $1.8M, 4.5% yield
4. **Lagos Solar Farm** — Renewable energy, $3.2M, 9.1% yield
5. **Singapore Cargo Ship** — Maritime freight, $12M, 11.3% yield
6. **Dubai Gold Vault** — Commodity storage, $5.5M, 3.2% yield

## Quick Test

```bash
# List all assets
curl http://localhost:8000/api/assets

# Get one asset
curl http://localhost:8000/api/assets/medellin-tech-hub

# Evaluate it (THE MAIN ENDPOINT)
curl -X POST "http://localhost:8000/api/evaluate?asset_id=medellin-tech-hub"

# List agents
curl http://localhost:8000/api/agents
```

## How It Works

### Evaluation Process

1. **Submit Asset**: User calls `/api/evaluate?asset_id=...`

2. **Parallel Assessment** (5-10 seconds):
   - Claude (The Auditor) analyzes the asset from a yield-maximalist perspective
   - GPT (The Risk Officer) analyzes from a risk-minimalist perspective
   - Both run in parallel for speed

3. **Arbitration** (2-3 seconds):
   - Llama (The Arbitrator) reads both assessments
   - Synthesizes into a balanced final recommendation
   - Explains where they agreed and disagreed

4. **Return Consensus**:
   - All three individual assessments
   - Final consensus metrics (risk, collateral, valuation)
   - Recommendation (Strong Buy, Buy, Hold, Caution, Strong Caution)

### Key Outputs

- **Risk Score** (1-100): Combined assessment of asset risk
- **Collateral Ratio** (e.g., 128%): How much collateral needed per $1 of value
- **Valuation**: Each agent provides a valuation estimate; Arbitrator reconciles
- **Debate Summary**: Where agents disagreed and how consensus was reached
- **Recommendation**: Final buy/sell signal based on risk/return profile

## Architecture

```
backend/
├── app.py                          # FastAPI app (5 new RWA endpoints + legacy)
├── schemas.py                      # Pydantic models (new RWA schemas)
├── services/
│   ├── ai_predictor.py            # Multi-LLM risk assessment with consensus
│   ├── rwa_assets.py              # Asset catalog and lookup
│   ├── price_feed.py              # Legacy price feed
│   └── battle_engine.py           # Legacy battle engine
├── .env                           # API keys (NOT committed)
├── requirements.txt               # Dependencies
└── README.md                      # This file
```

## Features

### AI Consensus System

- **Three Perspectives**: Optimistic (Auditor), Cautious (Risk Officer), Balanced (Arbitrator)
- **Real LLM Reasoning**: Not just ratings, agents provide detailed financial analysis
- **Transparent Debate**: See exactly where agents agree and disagree
- **Graceful Fallback**: If any AI API fails, system uses mock assessment in same style

### Rich Asset Data

- Asset type, location, estimated value, annual yield
- Detailed description with real-world context
- Pre-identified risk factors

### Type Safety

- Full Pydantic validation on all endpoints
- Structured JSON responses
- Clear error messages

## Error Handling

| Scenario | Response |
|----------|----------|
| Asset not found | 404 Not Found |
| Missing API keys | 500 (graceful mock fallback) |
| AI API timeout | Partial result or mock |
| Invalid request | 400 Bad Request |

## Legacy Endpoints

For backward compatibility with the OnePredict Arena system, these endpoints still work:

- `GET /api/price/{market}` — Crypto prices
- `GET /api/personalities` — AI personalities
- `POST /api/predict` — Single prediction
- `POST /api/battle/create` — Create battle
- `POST /api/battle/{battle_id}/resolve` — Resolve battle
- `GET /api/battles` — List battles
- `GET /api/leaderboard` — Leaderboard

## Development

### Adding New Assets

Edit `services/rwa_assets.py`:

```python
SAMPLE_ASSETS = {
    "my-asset": RWAAsset(
        id="my-asset",
        name="My Asset Name",
        asset_type="Asset Type",
        location="Location",
        estimated_value=1000000,
        yield_rate=5.0,
        description="Description...",
        risk_factors=["Risk 1", "Risk 2"],
    ),
}
```

### Customizing Agents

Edit agent personalities in `services/ai_predictor.py`:

```python
AI_PERSONALITIES = {
    "auditor": {
        "name": "The Auditor",
        "style": "Yield-Focused",
        "model": "claude-opus-4-1-20250805",
        "temperature": 0.9,
        "client_type": "anthropic",
    },
    ...
}
```

## API Documentation

- **Interactive Docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/redoc

## Notes

- AI evaluations use actual LLM APIs (Claude, GPT-4, Llama)
- If any API fails, system falls back to mock assessment in the same style
- All endpoints are async for fast responses
- Full type hints and Pydantic validation
- CORS enabled for all origins
- No database required (in-memory asset catalog)

## Next Steps

- Add asset persistence to PostgreSQL
- Integrate with blockchain for token minting
- Add historical evaluation tracking
- Build portfolio analysis (multiple assets)
- Add user authentication and saved evaluations
