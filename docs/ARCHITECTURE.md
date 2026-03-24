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

#### Pages
- **`app/arena/page.tsx`** — Main battle arena (4 states: SELECT → PREDICT → WAITING → RESULT)
- **`app/leaderboard/page.tsx`** — Top players, ranks, win rates
- **`app/profile/page.tsx`** — Connected player stats, history, streak

#### Components
- **`MarketSelector`** — Card-based market chooser (BTC, ETH, SOL, FLOW)
- **`AIOpponentCard`** — Opponent personality selector with descriptions
- **`PredictionPanel`** — UP/DOWN/FLAT buttons + real-time AI reasoning display
- **`CountdownTimer`** — Animated timer showing battle duration
- **`BattleResult`** — Win/loss display with price delta, AI explanation, "Play Again" button
- **`Header`** — Wallet connection button, nav to leaderboard/profile

#### State Management
- **React hooks** (`useState`, `useContext`)
- **API wrapper** (`lib/api.ts`) with fetch utilities
- **Constants** (`lib/constants.ts`) for markets, AI personalities, timeframes

### Backend (`backend/`)

#### Main Application
- **`app.py`** — FastAPI app with 8 REST endpoints
  - Health check
  - Price fetching
  - Personality listing
  - Prediction generation
  - Battle lifecycle (create, resolve, status)
  - Leaderboard

#### Services
- **`services/price_feed.py`**
  - Async fetch from CoinGecko
  - Caching to avoid rate limits
  - Market validation (BTC, ETH, SOL, FLOW)

- **`services/ai_predictor.py`**
  - `AI_PERSONALITIES` dict: Oracle, Sentinel, Prophet, Cipher
  - `get_ai_prediction()` — Calls appropriate LLM
  - Confidence generation based on personality
  - Reasoning explanation generation

- **`services/battle_engine.py`**
  - `create_battle()` — New battle state
  - `get_battle()` — Fetch battle by ID
  - `resolve_battle()` — Calculate winner, emit events
  - Battle storage (in-memory dict for hackathon)

#### Data Models
- **`schemas.py`** — Pydantic models
  - `PredictionRequest` (market, direction, timeframe)
  - `AIPrediction` (direction, confidence, reasoning, model)
  - `BattleResult` (winner, prices, explanation)

### Contracts (`contracts/sources/`)

#### `prediction_pool.move`
**Core smart contract on OneChain (Sui fork)**

##### Structs
- **`PredictionPool<T>`** — Holds all predictions for a market
  - `market` — Market symbol (BTC, ETH, SOL, FLOW)
  - `start_price`, `end_price` — Prices at start/end
  - `pool_balance` — Staked coins collected
  - `total_predictions` — Count of predictions
  - `status` — 0 (open) or 1 (resolved)

- **`Prediction`** — Individual player prediction
  - `player` — Player's address
  - `direction` — 1 (UP) or 2 (DOWN)
  - `amount` — Stake amount
  - `timestamp` — When prediction made

##### Functions
- **`create_pool()`** — Admin creates prediction pool for market
- **`make_prediction()`** — Player stakes coin + direction
- **`resolve_pool()`** — Admin resolves with end price, emits winner event
- **`get_direction()`** — Helper: returns UP/DOWN based on price change
- **`pool_is_open()`** — Helper: checks if pool still accepting predictions

##### Events
- `PoolCreated` — New market pool
- `PredictionMade` — Player staked
- `PoolResolved` — Winner determined

---

## AI Personality System

Each personality has distinct behavior affecting prediction and reasoning:

| Personality | Model | Style | Confidence Base | Example Reasoning |
|---|---|---|---|---|
| **Oracle** 🔮 | Claude 3 Sonnet | Data-driven, analytical | 60–75% | "Looking at the 4H chart, RSI is oversold. Expecting mean reversion UP." |
| **Sentinel** 🛡️ | GPT-4o | Momentum-based, technical | 50–70% | "Volume spike detected. Momentum favors DOWN. Setting stop at -2%." |
| **Prophet** 📈 | Llama 3.1 | Sentiment-based, narrative | 55–80% | "Social sentiment bullish. On-chain accumulation signals. Predicting UP." |
| **Cipher** ⚡ | Claude 3 Sonnet | Volatility-focused | 45–65% | "Volatility expanding. Expecting price swings. Lean DOWN but keep wide stops." |

**Confidence score** affects:
- Visual prominence in UI (higher confidence = bolder display)
- Player strategy (choosing cautious vs. bold opponents)
- Not directly used in battle logic (outcome is price-based, not confidence)

**Reasoning** shows:
- Why AI made the call
- What market signals influenced it
- Risk disclaimers for lower confidence

---

## OneChain Integration

### 1. OnePredict (Core Prediction Engine)
- Predictions submitted to `PredictionPool` contract
- Start/end prices anchored to OneDEX price feeds
- Pool can handle any market with price oracle

### 2. OneWallet (Authentication + Staking)
- Player authenticates via `@onelabs/dapp-kit`
- Wallet connection displays address
- Staking happens via Move transaction
  - Player sends coin to pool
  - `make_prediction()` called on-chain

### 3. OneDEX (Real-Time Price Feeds)
- `PredictionPool` can read price from OneDEX
- Currently using CoinGecko in backend (easier for hackathon)
- Production integration: read OneDEX price oracles in `resolve_pool()`

### 4. OneID (Player Profiles)
- Player address as identity
- Profile page shows wallet-connected stats
- Could extend to OneID for profile metadata

### 5. OnePlay (Gamification)
- Leaderboard = achievement tracking
- Win streaks, total earnings tracked in contract
- Could integrate for achievement badges/tokens

---

## Security Considerations

### Current (Hackathon) Setup
✅ **What's protected:**
- CORS enabled (all origins for testing)
- No hardcoded secrets
- API keys in `.env` (not committed)
- Battle state isolated by UUID

⚠️ **What's not (acceptable for hackathon):**
- No authentication on backend endpoints
- In-memory battle storage (lost on restart)
- Mock leaderboard data
- No rate limiting

### Production Roadmap
1. **Authentication**
   - Require JWT or OneWallet signature
   - Rate limit by wallet address

2. **Data Persistence**
   - Move battle storage to PostgreSQL
   - Leaderboard from OnChain contract reads

3. **Price Oracle**
   - Integrate OneDEX price oracle
   - Fallback to Pyth or Switchboard

4. **Smart Contract Validation**
   - Ensure all rewards distributed on-chain
   - Verify pool liquidity before accepting bets

---

## Future Roadmap

### Phase 2: Enhanced Gameplay
- **Tournaments** — Bracket-based multiplayer battles
- **Streaks & Achievements** — OnePlay badge system
- **Custom Timeframes** — 1m, 5m, 15m, 1h, 1d
- **AI vs AI** — Watch two AI personalities battle each other

### Phase 3: Monetization
- **Prize Pool** — Staking rewards from protocol fees
- **Sponsored Markets** — Brands sponsor specific markets
- **Seasonal Leaderboards** — Monthly/weekly resets with rewards

### Phase 4: Advanced AI
- **On-Chain AI Oracles** — AI predictions submitted to Pyth/Switchboard
- **Ensemble Models** — Combine Oracle + Sentinel + Prophet for better accuracy
- **Feedback Loop** — AI learns from historical battle outcomes

### Phase 5: Ecosystem
- **Mobile App** — React Native version
- **Discord Bot** — Challenge friends via Discord
- **Analytics Dashboard** — Player heat maps, market insights
- **API** — Allow external devs to build prediction UIs

---

## Deployment

### Frontend (Vercel/Web3 Compatible)
```
npm run build
npm run deploy  # Vercel auto-deploy on merge to main
```

### Backend (Heroku/Railway/Cloud Run)
```
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Contracts (OneChain Testnet)
```
cd contracts
one move publish --network testnet
```

---

## Technology Choices

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 15 + React 19 | SSR, modern hooks, strong ecosystem |
| Styling | TailwindCSS + shadcn/ui | Fast, accessible, beautiful UI |
| Backend | FastAPI | Async, auto-docs, Python ML ecosystem |
| Contracts | Move (Sui fork) | Type-safe, asset-oriented, OneChain native |
| Wallet | @onelabs/dapp-kit | OneChain native, smooth UX |
| Price Data | CoinGecko (+ OneDEX planned) | Free tier, reliable, no auth needed |
| AI Models | Claude/GPT/Llama | Different personalities, via LiteLLM proxy |

---

**Built for OneHack 3.0 | AI & GameFi Edition**
