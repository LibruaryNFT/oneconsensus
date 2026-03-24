# OnePredict Arena — FastAPI Backend

AI prediction battle game on crypto markets. Players predict price direction and compete against AI personalities.

## Setup

1. **Install dependencies** (optional, most are pre-installed):
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Add your API keys to .env
   ```

   Required keys:
   - `ANTHROPIC_API_KEY` — For Claude Aggressive personality
   - `OPENAI_API_KEY` — For GPT Cautious personality
   - `GROQ_API_KEY` — For Llama Balanced personality

3. **Run the server**:
   ```bash
   python app.py
   # Or with uvicorn:
   uvicorn app:app --reload
   ```

   Server starts at `http://localhost:8000`

## API Overview

### Health & Info
- `GET /health` — Health check
- `GET /` — API info and endpoints

### Price Feed
- `GET /api/price/{market}` — Get current price (BTC, ETH, SOL, OCT)

### AI Personalities
- `GET /api/personalities` — List all AI personalities
- `POST /api/predict` — Get AI prediction (no battle)

### Battles
- `POST /api/battle/create` — Start a new battle
- `GET /api/battle/{battle_id}` — Get battle status
- `POST /api/battle/{battle_id}/resolve` — Resolve battle and get result
- `GET /api/battles` — List all battles

## Example Usage

### 1. Start a Battle
```bash
curl -X POST http://localhost:8000/api/battle/create \
  -H "Content-Type: application/json" \
  -d '{"market": "BTC", "direction": "UP", "timeframe": 300}'
```

Response:
```json
{
  "battle_id": "abc-123",
  "market": "BTC",
  "player_direction": "UP",
  "timeframe": 300,
  "message": "Battle created! Wait 300s for resolution."
}
```

### 2. Check Battle Status
```bash
curl http://localhost:8000/api/battle/abc-123
```

### 3. Resolve Battle (after timeframe elapsed)
```bash
curl -X POST http://localhost:8000/api/battle/abc-123/resolve \
  -H "Content-Type: application/json" \
  -d '{"timeframe": 300}'
```

Response:
```json
{
  "battle_id": "abc-123",
  "market": "BTC",
  "timeframe": 300,
  "price_start": 69397.00,
  "price_end": 70123.45,
  "actual_direction": "UP",
  "player_prediction": "UP",
  "player_won": true,
  "ai_prediction": {
    "direction": "DOWN",
    "confidence": 0.72,
    "reasoning": "Bearish divergence on 5m chart...",
    "personality": {
      "name": "GPT Cautious",
      "style": "Cautious",
      "model": "gpt-4o-mini",
      "confidence": 0.60
    }
  },
  "ai_won": false
}
```

## Architecture

- **app.py** — FastAPI entry point with all routes
- **schemas.py** — Pydantic models for request/response validation
- **services/price_feed.py** — CoinGecko API integration for real-time prices
- **services/ai_predictor.py** — Multi-model AI predictor with 3 personalities
- **services/battle_engine.py** — Battle creation and resolution logic

## AI Personalities

| Name | Style | Model | Confidence |
|------|-------|-------|-----------|
| Claude Aggressive | Aggressive, bold | Claude 3 Haiku | 0.85 |
| GPT Cautious | Conservative, hedged | GPT-4o-mini | 0.60 |
| Llama Balanced | Data-driven, moderate | Llama 3.1 70B | 0.70 |

## Development

- Fast: Uses CoinGecko (no auth), async/await, ~100ms per request
- Hackathon: In-memory battle storage (no database)
- Extensible: Easy to add new personalities or price sources
- Clean: Type hints, Pydantic validation, error handling

## Notes

- Prices from CoinGecko API (free, no auth required)
- For hackathon: price changes are simulated (~2% volatility)
- Production version would store prices and poll after timeframe
- CORS allows all origins (adjust in production)
