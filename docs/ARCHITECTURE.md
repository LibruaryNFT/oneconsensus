# OnePredict Arena — Architecture

## System Overview

**OnePredict Arena** is a **3-tier AI prediction game** where human players challenge AI opponents to predict cryptocurrency price movements on OneChain.

```
┌─────────────────────────────────────────────────────────────┐
│                      PLAYER'S BROWSER                        │
├─────────────────────────────────────────────────────────────┤
│   Next.js Frontend (React 19, TailwindCSS, shadcn/ui)        │
│   - Market selection, AI opponent selection                  │
│   - Real-time prediction display with AI reasoning           │
│   - Battle countdown (5-60 seconds)                          │
│   - Result display with price delta analysis                 │
│   - Leaderboard + player profile                             │
│   - Wallet integration (OneWallet via dapp-kit)              │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API
                             │ (Market price, AI predictions,
                             │  Battle lifecycle, Leaderboard)
┌────────────────────────────▼────────────────────────────────┐
│                     BACKEND SERVER                           │
├─────────────────────────────────────────────────────────────┤
│   FastAPI (Python, async)                                    │
│   - 8 endpoints (health, price, personalities, predict)      │
│   - Price feeds (CoinGecko API)                              │
│   - Battle engine (create, resolve, track)                   │
│   - Leaderboard mock data                                    │
│   - AI predictor bridge (Claude, GPT, Llama)                 │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             │ Price Data                 │ LLM API Calls
             │                            │
    ┌────────▼──────────┐      ┌──────────▼──────────┐
    │  CoinGecko API    │      │  AI Model Engines   │
    │  (Price history)  │      │  - Claude 3 Sonnet  │
    │  OneDEX (real-    │      │  - GPT-4o           │
    │   time feeds)     │      │  - Llama 3.1        │
    └───────────────────┘      └─────────────────────┘
        │
        └────────────┬──────────────────────────────┐
                     │                              │
            ┌────────▼──────────┐      ┌───────────▼────┐
            │    OneChain       │      │   OneChain      │
            │    Contracts      │      │   Wallet        │
            │    (Move)         │      │   (Auth +       │
            │    - Prediction   │      │    Stake)       │
            │      Pool         │      │                 │
            │    - Leaderboard  │      └─────────────────┘
            │    - Rewards      │
            └───────────────────┘
```

---

## Data Flow

### 1. Game Initiation
1. Player connects OneWallet
2. Player selects **market** (BTC, ETH, SOL, FLOW)
3. Player selects **AI opponent** (Oracle, Sentinel, Prophet, Cipher)
4. Frontend fetches current price: `GET /api/price/{market}`
5. Backend returns price from CoinGecko

### 2. Battle Creation
1. Player makes prediction: **UP**, **DOWN**, or **FLAT**
2. Frontend calls `POST /api/battle/create` with:
   - Market
   - Player's direction
   - AI personality
3. Backend generates **battle_id** and initializes battle state
4. AI personality invoked: `POST /api/predict` returns:
   - AI's predicted direction
   - Confidence level (0–100)
   - Reasoning (why AI made this call)

### 3. Battle Resolution
1. Countdown timer runs (5–60 seconds configurable)
2. At timeout, frontend calls `POST /api/battle/{battle_id}/resolve`
3. Backend fetches **end price** from CoinGecko
4. Backend calculates direction (price went UP/DOWN/FLAT)
5. Outcome determined:
   - If player prediction == actual direction → **WIN** → stake × 2
   - If AI prediction == actual direction → **AI WINS** → stake lost
   - If price flat → **DRAW** → stake returned
6. Result sent to frontend with price delta

### 4. Leaderboard Update
- Player stats updated on OneChain contract (optional for hackathon)
- Leaderboard endpoint returns top 15 players

---

## Component Breakdown

### Frontend (`frontend/src/`)

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
