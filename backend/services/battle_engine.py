"""Battle creation and resolution engine."""

import uuid
import time
import logging
from typing import Dict, Optional
import asyncio

from schemas import AIPrediction, BattleResult
from services.price_feed import get_current_price, get_price_change
from services.ai_predictor import get_ai_prediction

logger = logging.getLogger(__name__)

# In-memory battle storage (for hackathon; use DB in production)
BATTLES: Dict[str, Dict] = {}


def create_battle(market: str, player_direction: str, ai_personality: Optional[str] = None) -> Dict:
    """
    Create a new battle instance.

    Args:
        market: Market symbol (BTC, ETH, SOL, OCT)
        player_direction: Player's prediction (UP or DOWN)
        ai_personality: AI personality to use (optional, random if None)

    Returns:
        Dict with battle_id, market, player_direction, ai_personality, timestamp
    """
    battle_id = str(uuid.uuid4())
    battle = {
        "battle_id": battle_id,
        "market": market.upper(),
        "player_direction": player_direction.upper(),
        "ai_personality": ai_personality,
        "created_at": time.time(),
        "resolved": False,
        "result": None,
    }

    BATTLES[battle_id] = battle
    logger.info(f"Created battle {battle_id}: {market} {player_direction} vs {ai_personality}")
    return battle


async def resolve_battle(battle_id: str, timeframe: int = 300) -> BattleResult:
    """
    Resolve a battle by comparing player and AI predictions to actual price movement.

    Args:
        battle_id: Unique battle identifier
        timeframe: Seconds to wait before resolving (default 300 = 5 minutes)

    Returns:
        BattleResult with outcome

    Raises:
        ValueError: If battle not found or resolution fails
    """
    if battle_id not in BATTLES:
        raise ValueError(f"Battle not found: {battle_id}")

    battle = BATTLES[battle_id]
    if battle["resolved"]:
        return battle["result"]

    market = battle["market"]
    player_direction = battle["player_direction"]
    ai_personality = battle["ai_personality"]

    try:
        # Get price data
        start_price, end_price, actual_direction = await get_price_change(market, timeframe)

        # Get AI prediction
        ai_prediction = await get_ai_prediction(market, start_price, ai_personality)

        # Determine winners
        player_won = player_direction == actual_direction
        ai_won = ai_prediction.direction == actual_direction

        result = BattleResult(
            battle_id=battle_id,
            market=market,
            timeframe=timeframe,
            price_start=start_price,
            price_end=end_price,
            actual_direction=actual_direction,
            player_prediction=player_direction,
            player_won=player_won,
            ai_prediction=ai_prediction,
            ai_won=ai_won,
        )

        # Store result
        battle["resolved"] = True
        battle["result"] = result
        logger.info(f"Resolved battle {battle_id}: Player {player_won}, AI {ai_won}")

        return result
    except Exception as e:
        logger.error(f"Battle resolution failed: {e}")
        raise ValueError(f"Failed to resolve battle: {e}")


def get_battle(battle_id: str) -> Optional[Dict]:
    """Get battle by ID."""
    return BATTLES.get(battle_id)


def list_battles() -> list:
    """Get all battles."""
    return list(BATTLES.values())
