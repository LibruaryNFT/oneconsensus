"""CoinGecko price feed service for crypto markets."""

import httpx
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

# CoinGecko API endpoint (free, no auth required)
COINGECKO_API = "https://api.coingecko.com/api/v3"

# Map market symbols to CoinGecko IDs
MARKET_MAP = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "OCT": "october",  # Placeholder — adjust if needed
}

# Fallback prices (for when API is rate-limited during hackathon)
FALLBACK_PRICES = {
    "bitcoin": 69408.50,
    "ethereum": 3850.25,
    "solana": 165.75,
    "october": 1.25,
}


async def get_current_price(market: str) -> float:
    """
    Get current price for a market from CoinGecko.

    Args:
        market: Market symbol (BTC, ETH, SOL, OCT)

    Returns:
        Current price in USD

    Raises:
        ValueError: If market not found or API fails
    """
    market_upper = market.upper()
    if market_upper not in MARKET_MAP:
        raise ValueError(f"Unsupported market: {market}. Supported: {list(MARKET_MAP.keys())}")

    coingecko_id = MARKET_MAP[market_upper]
    url = f"{COINGECKO_API}/simple/price?ids={coingecko_id}&vs_currencies=usd"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            price = data.get(coingecko_id, {}).get("usd")
            if price is None:
                raise ValueError(f"No price data returned for {market}")
            return float(price)
    except httpx.HTTPError as e:
        logger.warning(f"CoinGecko API error, using fallback: {e}")
        # Use fallback price if API is rate-limited or down
        fallback = FALLBACK_PRICES.get(coingecko_id)
        if fallback:
            return float(fallback)
        raise ValueError(f"Failed to fetch price for {market}: {e}")


async def get_price_change(market: str, seconds: int) -> Tuple[float, float, str]:
    """
    Get price at start and after timeframe, return direction.

    For hackathon: fetch current price as start, then return mock end price.
    In production, you'd store start price and poll after timeframe.

    Args:
        market: Market symbol (BTC, ETH, SOL, OCT)
        seconds: Timeframe in seconds (for now, ignored in mock mode)

    Returns:
        Tuple of (start_price, end_price, direction: "UP" or "DOWN")
    """
    start_price = await get_current_price(market)

    # For hackathon: simulate a random price change
    # In production, you'd store the start price and poll after `seconds`
    import random

    volatility = 0.02  # 2% price swing
    change_percent = random.uniform(-volatility, volatility)
    end_price = start_price * (1 + change_percent)

    direction = "UP" if end_price > start_price else "DOWN"

    return start_price, end_price, direction
