"""FastAPI app for OnePredict Arena."""

import logging
import time
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import AIPrediction, BattleResult, PredictionRequest
from services.ai_predictor import AI_PERSONALITIES, get_ai_prediction
from services.battle_engine import create_battle, get_battle, list_battles, resolve_battle
from services.price_feed import get_current_price

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown."""
    logger.info("OnePredict Arena backend starting...")
    yield
    logger.info("OnePredict Arena backend shutting down...")


# Create FastAPI app
app = FastAPI(
    title="OnePredict Arena",
    description="AI prediction battle game on crypto markets",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware (allow all origins for hackathon)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# === Health Endpoints ===
@app.get("/health")
@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "OnePredict Arena"}


# === Price Feed Endpoints ===
@app.get("/api/price/{market}")
async def get_price(market: str):
    """
    Get current price for a market.

    Args:
        market: Market symbol (BTC, ETH, SOL, OCT)

    Returns:
        Current price in USD
    """
    try:
        price = await get_current_price(market)
        return {"market": market.upper(), "price": price}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Price fetch failed: {e}")
        raise HTTPException(status_code=500, detail="Price fetch failed")


# === AI Predictor Endpoints ===
@app.get("/api/personalities")
async def list_personalities():
    """
    List all available AI personalities.

    Returns:
        List of personality configs
    """
    personalities = []
    for key, config in AI_PERSONALITIES.items():
        personalities.append(
            {
                "id": key,
                "name": config["name"],
                "style": config["style"],
                "model": config["model"],
                "confidence_base": config["confidence_base"],
            }
        )
    return {"personalities": personalities}


@app.post("/api/predict")
async def get_prediction(request: PredictionRequest) -> AIPrediction:
    """
    Get AI prediction for a market without starting a battle.

    Args:
        request: PredictionRequest with market, direction, timeframe

    Returns:
        AIPrediction from a random AI personality
    """
    try:
        price = await get_current_price(request.market)
        prediction = await get_ai_prediction(request.market, price)
        return prediction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction generation failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction generation failed")


# === Battle Endpoints ===
@app.post("/api/battle/create")
async def start_battle(request: PredictionRequest):
    """
    Create a new battle against an AI opponent.

    Args:
        request: PredictionRequest with market, direction, timeframe

    Returns:
        Battle info with battle_id, market, timeframe
    """
    try:
        # Validate market exists by fetching price
        await get_current_price(request.market)

        # Create battle
        battle = create_battle(
            market=request.market,
            player_direction=request.direction,
            ai_personality=None,  # Random selection
        )

        return {
            "battle_id": battle["battle_id"],
            "market": battle["market"],
            "player_direction": battle["player_direction"],
            "timeframe": request.timeframe,
            "message": f"Battle created! Wait {request.timeframe}s for resolution.",
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Battle creation failed: {e}")
        raise HTTPException(status_code=500, detail="Battle creation failed")


@app.post("/api/battle/{battle_id}/resolve")
async def resolve_battle_endpoint(battle_id: str, timeframe: int = 300) -> BattleResult:
    """
    Resolve a battle and get the result.

    Args:
        battle_id: Unique battle identifier
        timeframe: Seconds elapsed (default 300 = 5 minutes)

    Returns:
        BattleResult with outcome and price data
    """
    try:
        result = await resolve_battle(battle_id, timeframe)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Battle resolution failed: {e}")
        raise HTTPException(status_code=500, detail="Battle resolution failed")


@app.get("/api/battle/{battle_id}")
async def get_battle_status(battle_id: str):
    """
    Get battle status and result if resolved.

    Args:
        battle_id: Unique battle identifier

    Returns:
        Battle info with status and optional result
    """
    battle = get_battle(battle_id)
    if not battle:
        raise HTTPException(status_code=404, detail="Battle not found")

    response = {
        "battle_id": battle["battle_id"],
        "market": battle["market"],
        "player_direction": battle["player_direction"],
        "created_at": battle["created_at"],
        "resolved": battle["resolved"],
    }

    if battle["resolved"]:
        response["result"] = battle["result"]

    return response


@app.get("/api/battles")
async def get_all_battles():
    """Get all battles (for debugging/stats)."""
    battles = list_battles()
    return {
        "total": len(battles),
        "battles": [
            {
                "battle_id": b["battle_id"],
                "market": b["market"],
                "resolved": b["resolved"],
                "created_at": b["created_at"],
            }
            for b in battles
        ],
    }


# === Leaderboard Endpoint ===
@app.get("/api/leaderboard")
async def get_leaderboard():
    """
    Get top players leaderboard (mock data for hackathon).

    Returns:
        List of top 15 players with wins, total battles, win rate
    """
    # Mock leaderboard data
    mock_players = [
        {"rank": 1, "name": "CryptoMaster", "wins": 47, "total_battles": 63, "win_rate": 0.746},
        {"rank": 2, "name": "TrendFollower", "wins": 44, "total_battles": 62, "win_rate": 0.710},
        {"rank": 3, "name": "SafeHands", "wins": 39, "total_battles": 58, "win_rate": 0.672},
        {"rank": 4, "name": "VoltageMax", "wins": 38, "total_battles": 61, "win_rate": 0.623},
        {"rank": 5, "name": "MarketWhisperer", "wins": 36, "total_battles": 57, "win_rate": 0.632},
        {"rank": 6, "name": "QuickTrade", "wins": 35, "total_battles": 59, "win_rate": 0.593},
        {"rank": 7, "name": "LongTermBull", "wins": 33, "total_battles": 56, "win_rate": 0.589},
        {"rank": 8, "name": "RiskManager", "wins": 31, "total_battles": 60, "win_rate": 0.517},
        {"rank": 9, "name": "SwiftAnalyzer", "wins": 29, "total_battles": 55, "win_rate": 0.527},
        {"rank": 10, "name": "DataDriven", "wins": 27, "total_battles": 54, "win_rate": 0.500},
        {"rank": 11, "name": "NoiseFilter", "wins": 25, "total_battles": 52, "win_rate": 0.481},
        {"rank": 12, "name": "MomentumRider", "wins": 23, "total_battles": 51, "win_rate": 0.451},
        {"rank": 13, "name": "CalmInStorm", "wins": 22, "total_battles": 56, "win_rate": 0.393},
        {"rank": 14, "name": "PatternSeeker", "wins": 20, "total_battles": 49, "win_rate": 0.408},
        {"rank": 15, "name": "NewTrader", "wins": 18, "total_battles": 45, "win_rate": 0.400},
    ]

    return {"leaderboard": mock_players, "timestamp": int(time.time())}


# === Root endpoint ===
@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "service": "OnePredict Arena",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "price": "GET /api/price/{market}",
            "personalities": "GET /api/personalities",
            "predict": "POST /api/predict",
            "create_battle": "POST /api/battle/create",
            "resolve_battle": "POST /api/battle/{battle_id}/resolve",
            "battle_status": "GET /api/battle/{battle_id}",
            "all_battles": "GET /api/battles",
            "leaderboard": "GET /api/leaderboard",
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
    )
