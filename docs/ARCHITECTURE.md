# OneConsensus — Architecture

## System Overview

**OneConsensus** is a **multi-agent AI risk assessment platform** for real-world assets on OneChain. Three agents with different perspectives evaluate RWA risk, reach consensus, and provide on-chain verified assessment.

```
┌──────────────────────────────────────────────────────────────┐
│              RWA INVESTOR / ANALYST PORTAL                   │
│  (Web UI, Mobile App, or Direct API Client)                  │
└────────────────────────┬─────────────────────────────────────┘
                         │ REST API
                         │ (Assets, Evaluations, Agents)
┌────────────────────────▼─────────────────────────────────────┐
│                  ONECONSENSUS BACKEND                         │
│          FastAPI (Python, async consensus engine)            │
├──────────────────────────────────────────────────────────────┤
│                    RWA EVALUATION LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   AUDITOR    │  │ RISK OFFICER │  │ ARBITRATOR   │       │
│  │  (Claude)    │  │  (GPT-4o)    │  │ (Llama 70B)  │       │
│  │              │  │              │  │              │       │
│  │ Yield Outlook│  │ Risk Analysis│  │ Reconcile    │       │
│  │ Lower Collat │  │ Higher Collat│  │ Final Call   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  Evaluates: ↓         Evaluates: ↓      Synthesis: ↓        │
│  - Growth potential   - Geopolitical risk - Consensus score │
│  - Inflation hedge    - Regulatory risk  - Collateral ratio  │
│  - Lease quality      - Market volatility - Valuation        │
│                                          - Recommendation    │
├──────────────────────────────────────────────────────────────┤
│                    ASSET REGISTRY LAYER                      │
│  - 6 sample RWA assets (real estate, energy, maritime)       │
│  - Asset descriptors, risk factors, yield rates              │
└──────────┬───────────────────────┬────────────────────────────┘
           │                       │
   ┌───────▼──────┐       ┌────────▼──────────┐
   │  LLM APIs    │       │  OneChain         │
   │              │       │  (Future Wiring)  │
   │ - Anthropic  │       │  - OneRWA         │
   │   (Claude)   │       │  - OneWallet      │
   │ - OpenAI     │       │  - OnePredict     │
   │   (GPT-4o)   │       │  - OneID          │
   │ - Groq       │       │                   │
   │   (Llama)    │       └───────────────────┘
   └──────────────┘
```

---

## Data Flow: Asset Evaluation

### 1. Investor Initiates Evaluation
1. Investor calls `POST /api/evaluate?asset_id=medellin-tech-hub`
2. System fetches asset metadata (location, value, yield, risks)
3. **Two agents launch in parallel:**

### 2a. Auditor Assessment (Parallel)
- System sends asset to Claude Opus with prompt:
  - "You are a yield-maximalist financial analyst"
  - "Identify growth potential, positive cash flows, collateral floor"
  - "Propose lower collateral requirements"
- Claude returns:
  - Risk score (typically 25–40)
  - Collateral ratio (typically 110–120%)
  - Valuation estimate
  - Detailed reasoning

### 2b. Risk Officer Assessment (Parallel)
- System sends asset to GPT-4o-mini with prompt:
  - "You are a risk-minimalist financial regulator"
  - "Identify downside scenarios, regulatory risks, tail events"
  - "Propose higher collateral requirements"
- GPT returns:
  - Risk score (typically 50–70)
  - Collateral ratio (typically 140–160%)
  - Valuation estimate
  - Detailed reasoning

### 3. Arbitrator Synthesis (Sequential)
- Arbitrator (Llama 70B) reads both assessments
- Arbitrator synthesizes:
  - Final risk score (weighted average, typically 40–50)
  - Final collateral ratio (compromise, typically 125–135%)
  - Debate summary: "Auditor bullish on yield, Risk Officer cautious on political risk"
  - Final recommendation: Strong Buy / Buy / Hold / Caution / Strong Caution
  - Explanation of consensus reasoning

### 4. Return Full Assessment
Investor receives:
```json
{
  "asset": { ... },
  "assessments": [
    { "agent": "Auditor", "risk_score": 32, "collateral_ratio": 112.5, ... },
    { "agent": "Risk Officer", "risk_score": 58, "collateral_ratio": 145.0, ... },
    { "agent": "Arbitrator", "risk_score": 45, "collateral_ratio": 128.0, ... }
  ],
  "final_risk_score": 45.0,
  "final_collateral_ratio": 128.0,
  "consensus_reasoning": "...",
  "recommendation": "Buy"
}
```

---

## Key Architectural Decisions

### 1. **Parallel Assessment (Auditor + Risk Officer)**
- **Why:** Consensus requires debate. Two perspectives running in parallel avoids false consensus.
- **Implementation:** `asyncio.gather(auditor_task, risk_officer_task)` runs both concurrently
- **Benefit:** 5–10 second evaluation vs. 15+ if sequential

### 2. **Asymmetric Agent Personalities**
- **Auditor:** Temperature=0.9 (more creative, optimistic framings)
- **Risk Officer:** Temperature=0.6 (more analytical, risk-focused)
- **Arbitrator:** Temperature=0.7 (balanced)
- **Why:** Different "styles" from different temperatures create realistic disagreement

### 3. **LLM Diversity** (Not LLM Consensus)
- **Auditor:** Claude Opus (good at financial reasoning, structured analysis)
- **Risk Officer:** GPT-4o-mini (good at risk taxonomy, regulatory frameworks)
- **Arbitrator:** Llama 3.1 70B (open-source, good at synthesis, lower cost)
- **Why:** Different models think differently. Consensus across 3 models > consensus from 1 model repeated 3 times

### 4. **Graceful Fallback**
If any API fails:
- System still returns assessment in the agent's style (mock if needed)
- Response labeled clearly ("using fallback reasoning")
- No crashes, judges see full flow even without real API keys
- **Why:** Hackathon stability + production readiness

---

## Move Smart Contract Design

### `rwa_assessment.move` (Skeleton)

**Struct: RWAAssetAssessment**
```move
public struct RWAAssetAssessment<T> has key {
    id: UID,
    asset_id: String,
    auditor_risk_score: u8,
    risk_officer_risk_score: u8,
    arbitrator_risk_score: u8,
    final_collateral_ratio: u64,
    timestamp: u64,
    assessor: address,
}
```

**Entry Function: store_assessment**
```move
public fun store_assessment(
    asset_id: String,
    auditor_score: u8,
    risk_officer_score: u8,
    arbitrator_score: u8,
    collateral_ratio: u64,
    ctx: &mut TxContext,
) { ... }
```

**Integration Path:**
1. Backend evaluates asset → gets consensus scores
2. Backend calls `store_assessment` on OneChain
3. Scores recorded on-chain for history/appeal
4. RWA protocol reads latest assessment
5. Collateral pool adjusts based on consensus ratio

---

## API Endpoints

### 1. List Assets
```
GET /api/assets
```
Returns all RWA assets with basic info (6 samples)

### 2. Get Asset Details
```
GET /api/assets/{asset_id}
```
Returns full asset metadata + risk factors

### 3. Evaluate Asset (Main Endpoint)
```
POST /api/evaluate?asset_id={asset_id}
```
Triggers 3-agent consensus (5–15 seconds)

### 4. List Agents
```
GET /api/agents
```
Returns Auditor, Risk Officer, Arbitrator metadata

### 5. Health Check
```
GET /health
GET /api/health
```

---

## Component Breakdown

### Frontend (`frontend/src/` — Coming Soon)

#### Future Pages
- **`app/assets/page.tsx`** — Asset browser, search, filter by type
- **`app/evaluate/page.tsx`** — Asset selection → consensus display
- **`app/investor/dashboard.tsx`** — Investor's portfolio, past evaluations

#### Components
- **`AssetCard`** — Asset name, type, location, value, yield
- **`ConsensusDisplay`** — 3-panel debate view (Auditor | Risk Officer | Arbitrator)
- **`RiskMeter`** — Visual risk score (1-100)
- **`CollateralRatio`** — Visual collateral requirement
- **`DebateSummary`** — Where agents agreed/disagreed

#### State Management
- **React hooks** (`useState`, `useEffect`)
- **API wrapper** (`lib/api.ts`) — Calls OneConsensus backend
- **Constants** (`lib/constants.ts`) — Asset types, risk categories

### Backend (`backend/`)

#### Main Application
- **`app.py`** — FastAPI app with 5 core RWA endpoints
  - `GET /api/assets` — List all assets
  - `GET /api/assets/{asset_id}` — Asset details
  - `POST /api/evaluate` — **Main endpoint** (triggers consensus)
  - `GET /api/agents` — Agent metadata
  - `GET /health` — Health check

#### Services
- **`services/ai_predictor.py`**
  - `AI_PERSONALITIES` dict: Auditor, Risk Officer, Arbitrator
  - `get_auditor_assessment()` — Claude analysis (parallel)
  - `get_risk_officer_assessment()` — GPT analysis (parallel)
  - `get_arbitrator_consensus()` — Llama synthesis (sequential)
  - Prompt engineering for distinct perspectives

- **`services/rwa_assets.py`**
  - Asset catalog (6 samples)
  - Asset lookup, validation
  - Structured RWAAsset model

- **`services/consensus_engine.py`**
  - `evaluate_asset()` — Orchestrates 3-agent evaluation
  - Parallel execution (asyncio)
  - Result aggregation
  - Recommendation logic (based on risk/collateral spread)

#### Data Models
- **`schemas.py`** — Pydantic models
  - `RWAAsset` (id, name, type, location, value, yield, risks)
  - `AssessmentResult` (agent_name, risk_score, collateral_ratio, reasoning)
  - `EvaluationResponse` (all 3 assessments + consensus)

### Contracts (Deployed on OneChain Testnet)

#### Live Deployment
**Package ID:** `0x1f0b34d95db5859753f3aa7508055c5c049e33d313acf3585bf039cf22fb974e`

**Modules Deployed:**
- `leaderboard` — Ranking system for risk analysts
- `prediction_pool` — Asset evaluation pool
- `rewards` — Incentive distribution

**Verification:** [OneScan Explorer](https://onescan.cc/testnet/object/0x1f0b34d95db5859753f3aa7508055c5c049e33d313acf3585bf039cf22fb974e)

#### `rwa_assessment.move`
**Smart contract for on-chain assessment storage (OneChain)**

##### Struct
- **`RWAAssetAssessment<T>`**
  - `asset_id` — Reference to asset
  - `auditor_risk_score`, `risk_officer_risk_score`, `arbitrator_risk_score`
  - `final_collateral_ratio`
  - `timestamp`, `assessor`

##### Functions
- **`store_assessment()`** — Backend submits consensus to chain
- **`get_assessment()`** — Query historical assessments
- **`appeal()`** — Future: investor can challenge assessment

---

## AI Agent System

Three distinct financial personas with different models and prompts:

| Agent | Model | Temperature | Focus | Example Output |
|-------|-------|-------------|-------|-----------------|
| **Auditor** 📊 | Claude Opus 4 | 0.9 | Yield optimization, growth, positive scenarios | Risk Score: 32, Collateral: 112.5%, "Strong opportunity in emerging tech hub..." |
| **Risk Officer** 🛡️ | GPT-4o-mini | 0.6 | Risk mitigation, regulatory, downside scenarios | Risk Score: 58, Collateral: 145.0%, "Geopolitical volatility requires higher cushion..." |
| **Arbitrator** ⚖️ | Llama 3.1 70B | 0.7 | Synthesis, balance, final call | Risk Score: 45, Collateral: 128.0%, "Balancing growth with prudence..." |

**Temperature Effect:**
- **Higher temp (0.9):** More exploratory, optimistic framings
- **Lower temp (0.6):** More analytical, risk-focused framings
- **Mid temp (0.7):** Balanced synthesis

**Model Diversity:**
- Claude → Strong financial reasoning
- GPT → Regulatory/compliance knowledge
- Llama → Open-source, cost-effective synthesis

---

## OneChain Integration Points

### 1. OneRWA (Asset Registry)
- OneConsensus evaluations feed into RWA tokenization
- Risk scores → collateral pool initialization
- Consensus verified on-chain

### 2. OneWallet (Investor Auth)
- Investor connects wallet to access evaluations
- Future: stake ARENA token to weight own risk votes

### 3. OnePredict (Risk Oracle)
- Risk scores submitted to Pyth/Switchboard
- Derivatives pricing reads consensus scores
- Enables hedging instruments

### 4. OneID (Investor Identity)
- KYC metadata linked to OneID
- Auditor reputation tracking
- Future: accredited investor verification

### 5. OnePlay (Analyst Leaderboard)
- Top risk analysts earn tokens
- Accuracy tracking against real-world outcomes
- Future: achievement badges

---

## Error Handling & Resilience

### API Failures
If Claude/GPT/Groq API unavailable:
- System returns **mock assessment** in agent's style
- Response labeled: `"reasoning": "Using fallback assessment due to API timeout"`
- No 500 error; judges see full flow

### Graceful Degradation
- Missing optional fields → sensible defaults
- Invalid asset ID → 404 with clear message
- Malformed request → 400 with validation details

---

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| List assets | 50ms | In-memory |
| Get asset details | 50ms | In-memory |
| Auditor + Risk Officer (parallel) | 5–10s | Two LLM calls in parallel |
| Arbitrator synthesis | 2–3s | Sequential after both ready |
| **Total evaluation** | **7–13s** | Parallel + sequential |

**Optimization opportunities:**
- Cache evaluations (same asset evaluated often)
- Batch evaluations (multiple assets in one request)
- Async frontend polling (show in-progress updates)

---

## Future Roadmap

### Phase 2: Enhanced Asset Coverage
- Add 100+ real-world RWA examples
- Custom asset submission (investor-supplied metadata)
- Asset portfolio analysis (multiple assets)

### Phase 3: Feedback Loop
- Track real-world asset outcomes vs. AI predictions
- Retrain/fine-tune agents based on accuracy
- Consensus mechanism improves over time

### Phase 4: On-Chain Governance
- Token holders vote on agent parameters
- Reputation system for auditors
- Appeal process for asset classifications

### Phase 5: Multi-Regional Scaling
- Region-specific agents (Asia risk expert, Europe regulatory specialist)
- Local market knowledge integrated into consensus
- Cross-border RWA evaluation

---

## Deployment

### Backend (Local Development)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
# API at http://localhost:8000
```

### Backend (Production)
```bash
# Docker
docker build -t oneconsensus-backend .
docker run -e ANTHROPIC_API_KEY=... -e OPENAI_API_KEY=... -p 8000:8000 oneconsensus-backend

# Or Railway/Render (see DEPLOY.md)
```

### Contracts (OneChain Testnet)
```bash
cd contracts
one move build
one move publish --network testnet
```

---

## Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Backend | FastAPI (Python) | Async, type-safe, great for AI orchestration |
| AI Models | Claude/GPT/Llama | Different strengths, accessible APIs |
| Smart Contracts | Move (OneChain) | Type-safe assets, OneChain native |
| Frontend (Future) | Next.js 15 + React 19 | SSR, modern DX |
| Authentication | OneWallet + JWT | OneChain native |
| Database | PostgreSQL (future) | Asset history, evaluation logs |

---

**Built for OneHack 3.0 | AI & GameFi Edition**
