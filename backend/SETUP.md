# OnePredict Arena Backend Setup Guide

## Overview

OnePredict Arena is a FastAPI backend for an AI prediction battle game on crypto markets. Players make price predictions and compete against AI opponents with different personalities (Claude Aggressive, GPT Cautious, Llama Balanced).

## Prerequisites

- Python 3.8+
- pip

## Installation

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Environment Variables

Copy the template and fill in API keys:

```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:
- `ANTHROPIC_API_KEY` — Claude API (Anthropic)
- `OPENAI_API_KEY` — GPT-4o-mini (OpenAI)
- `GROQ_API_KEY` — Llama 70B (Groq)

**Note**: API keys are already populated if you copied from `<eco-root>/.env`. Do NOT commit the `.env` file.

### 3. Run the Server

```bash
python app.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /health` or `GET /api/health` — Server health status
  ```bash
  curl http://localhost:8000/health
  ```

### Price Feed
- `GET /api/price/{market}` — Get current price for BTC, ETH, SOL, OCT
  ```bash
  curl http://localhost:8000/api/price/btc
  ```

### AI Predictions
- `GET /api/personalities` — List all AI personality profiles
  ```bash
  curl http://localhost:8000/api/personalities
  ```

- `POST /api/predict` — Get a single AI prediction (without battle)
  ```bash
  curl -X POST http://localhost:8000/api/predict \
    -H "Content-Type: application/json" \
    -d '{"market":"btc","direction":"UP","timeframe":300}'
  ```

### Battle Management
- `POST /api/battle/create` — Start a new battle
  ```bash
  curl -X POST http://localhost:8000/api/battle/create \
    -H "Content-Type: application/json" \
    -d '{"market":"eth","direction":"DOWN","timeframe":300}'
  ```

- `GET /api/battle/{battle_id}` — Check battle status
  ```bash
  curl http://localhost:8000/api/battle/{battle_id}
  ```

- `POST /api/battle/{battle_id}/resolve` — Resolve a battle (check winner)
  ```bash
  curl -X POST http://localhost:8000/api/battle/{battle_id}/resolve
  ```

- `GET /api/battles` — Get all battles (debugging)
  ```bash
  curl http://localhost:8000/api/battles
  ```

### Leaderboard
- `GET /api/leaderboard` — Get top 15 players with stats
  ```bash
  curl http://localhost:8000/api/leaderboard
  ```

## Architecture

```
backend/
├── app.py                 # Main FastAPI app with all endpoints
├── schemas.py            # Pydantic models for request/response validation
├── services/
│   ├── price_feed.py     # CoinGecko API integration (real-time prices)
│   ├── ai_predictor.py   # AI personality system with 3 LLM backends
│   └── battle_engine.py  # Battle creation, resolution, in-memory storage
├── .env                  # API keys (NOT committed)
├── .env.example          # Template for environment setup
├── requirements.txt      # Python dependencies
└── SETUP.md             # This file
```

## Data Storage

- **Battles**: Stored in-memory (dict) — resets on server restart
- **Prices**: Fetched from CoinGecko API (free, rate-limited)
- **AI Predictions**: Generated on-demand via API calls

**For production**: Replace in-memory battle storage with PostgreSQL.

## AI Personalities

### 1. Claude Aggressive
- Model: Claude Opus 4
- Style: Bold, high-conviction calls
- Confidence Base: 0.85
- Temperature: 0.9

### 2. GPT Cautious
- Model: GPT-4o-mini
- Style: Conservative, acknowledges uncertainty
- Confidence Base: 0.60
- Temperature: 0.3

### 3. Llama Balanced
- Model: Llama 3.1 70B (Groq)
- Style: Balanced risk/data analysis
- Confidence Base: 0.70
- Temperature: 0.6

## Error Handling

The backend gracefully handles AI API failures:
- If Anthropic/OpenAI/Groq calls fail, a mock prediction is generated
- Mock predictions preserve personality style but with random direction
- Price feed falls back to cached prices if CoinGecko is rate-limited

## Testing

Run the test script to verify all endpoints:

```bash
bash test_endpoints.sh
```

Or manually test each endpoint:

```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/price/btc
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"market":"btc","direction":"UP","timeframe":300}'
```

## Development

### Code Style
- Type hints on all public functions
- Docstrings for all endpoints and services
- Async/await for I/O operations
- Pydantic models for validation

### Adding New Personalities

Edit `services/ai_predictor.py`:

```python
AI_PERSONALITIES = {
    "my-personality": {
        "name": "My Personality",
        "style": "My Style",
        "model": "model-name",
        "confidence_base": 0.70,
        "temperature": 0.6,
        "client_type": "anthropic|openai|groq",
    },
}
```

Then add the corresponding AI function:
```python
async def _get_my_prediction(market: str, current_price: float, personality: str) -> dict:
    # Implementation...
```

### Adding New Markets

Edit `services/price_feed.py`:

```python
MARKET_MAP = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "OCT": "october",
    "MY_MARKET": "coingecko-id",  # Add here
}

FALLBACK_PRICES = {
    "my-market": 1.00,  # Add fallback price
}
```

## Deployment

For production deployment:
1. Use a proper ASGI server (Gunicorn with Uvicorn workers)
2. Replace in-memory battle storage with a database
3. Add authentication/authorization
4. Set up rate limiting
5. Configure proper logging and error tracking
6. Use environment secrets management (GCP Secret Manager, etc.)

## Support

For issues with:
- **API endpoints**: Check logs in the running server
- **AI predictions**: Verify API keys in `.env`
- **Prices**: Check CoinGecko API status
- **Battle creation**: Verify market is supported
