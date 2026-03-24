"""AI predictor service with multiple personality styles."""

import logging
import os
from typing import Optional

import anthropic
import httpx
import openai
from schemas import AIPersonality, AIPrediction

logger = logging.getLogger(__name__)

# Lazy-initialized AI clients
_anthropic_client = None
_openai_client = None


def _get_anthropic_client():
    """Get or initialize Anthropic client."""
    global _anthropic_client
    if _anthropic_client is None:
        try:
            _anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        except Exception as e:
            logger.warning(f"Failed to initialize Anthropic client: {e}")
    return _anthropic_client


def _get_openai_client():
    """Get or initialize OpenAI client."""
    global _openai_client
    if _openai_client is None:
        try:
            _openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        except Exception as e:
            logger.warning(f"Failed to initialize OpenAI client: {e}")
    return _openai_client


# Groq API (via httpx, since no official SDK in requirements)
GROQ_API_BASE = "https://api.groq.com/openai/v1"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


AI_PERSONALITIES = {
    "claude-aggressive": {
        "name": "Claude Aggressive",
        "style": "Aggressive",
        "model": "claude-opus-4-1-20250805",
        "confidence_base": 0.85,
        "temperature": 0.9,
        "client_type": "anthropic",
    },
    "gpt-cautious": {
        "name": "GPT Cautious",
        "style": "Cautious",
        "model": "gpt-4o-mini",
        "confidence_base": 0.60,
        "temperature": 0.3,
        "client_type": "openai",
    },
    "llama-balanced": {
        "name": "Llama Balanced",
        "style": "Balanced",
        "model": "llama-3.1-70b-versatile",
        "confidence_base": 0.70,
        "temperature": 0.6,
        "client_type": "groq",
    },
}


def _get_prediction_prompt(market: str, current_price: float, style: str) -> str:
    """Build a prompt tailored to the AI personality style."""
    base_prompt = f"""You are a crypto market predictor. Analyze {market} at price ${current_price:.2f}.

Predict if the price will go UP or DOWN in the next 5 minutes.

Respond ONLY with valid JSON (no markdown, no extra text):
{{
  "direction": "UP" or "DOWN",
  "confidence": 0.0 to 1.0,
  "reasoning": "2-3 sentence explanation"
}}"""

    if style == "Aggressive":
        return base_prompt + "\n\nStyle: Be bold and confident. Take strong positions. High conviction calls."
    elif style == "Cautious":
        return base_prompt + "\n\nStyle: Be conservative and hedge. Acknowledge uncertainty. Low conviction acceptable."
    else:  # Balanced
        return base_prompt + "\n\nStyle: Balance risk and data. Moderate conviction. Consider both sides."


async def _get_claude_prediction(market: str, current_price: float, personality: str) -> dict:
    """Get prediction from Claude Haiku."""
    client = _get_anthropic_client()
    if not client:
        raise ValueError("Anthropic client not initialized. Check ANTHROPIC_API_KEY.")

    config = AI_PERSONALITIES[personality]
    prompt = _get_prediction_prompt(market, current_price, config["style"])

    try:
        message = client.messages.create(
            model=config["model"],
            max_tokens=200,
            temperature=config["temperature"],
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = message.content[0].text.strip()

        # Clean up markdown if present
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
            response_text = response_text.strip()

        import json

        prediction = json.loads(response_text)
        return prediction
    except Exception as e:
        logger.error(f"Claude prediction failed: {e}")
        raise ValueError(f"Claude AI failed: {e}")


async def _get_openai_prediction(market: str, current_price: float, personality: str) -> dict:
    """Get prediction from OpenAI GPT-4o-mini."""
    client = _get_openai_client()
    if not client:
        raise ValueError("OpenAI client not initialized. Check OPENAI_API_KEY.")

    config = AI_PERSONALITIES[personality]
    prompt = _get_prediction_prompt(market, current_price, config["style"])

    try:
        response = client.chat.completions.create(
            model=config["model"],
            max_tokens=200,
            temperature=config["temperature"],
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = response.choices[0].message.content.strip()

        # Clean up markdown if present
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
            response_text = response_text.strip()

        import json

        prediction = json.loads(response_text)
        return prediction
    except Exception as e:
        logger.error(f"OpenAI prediction failed: {e}")
        raise ValueError(f"OpenAI AI failed: {e}")


async def _get_groq_prediction(market: str, current_price: float, personality: str) -> dict:
    """Get prediction from Groq Llama."""
    config = AI_PERSONALITIES[personality]
    prompt = _get_prediction_prompt(market, current_price, config["style"])

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{GROQ_API_BASE}/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                json={
                    "model": config["model"],
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 200,
                    "temperature": config["temperature"],
                },
            )
            response.raise_for_status()
            data = response.json()
            response_text = data["choices"][0]["message"]["content"].strip()

            # Clean up markdown if present
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1]
                if response_text.startswith("json"):
                    response_text = response_text[4:]
                response_text = response_text.strip()

            import json

            prediction = json.loads(response_text)
            return prediction
    except Exception as e:
        logger.error(f"Groq prediction failed: {e}")
        raise ValueError(f"Groq AI failed: {e}")


async def get_ai_prediction(market: str, current_price: float, personality: Optional[str] = None) -> AIPrediction:
    """
    Get AI prediction for a market using specified personality.

    Args:
        market: Market symbol (BTC, ETH, SOL, OCT)
        current_price: Current market price
        personality: Personality key (claude-aggressive, gpt-cautious, llama-balanced).
                    If None, randomly select one.

    Returns:
        AIPrediction with direction, confidence, reasoning, and personality info

    Falls back to mock prediction if AI call fails.
    """
    import random

    if personality is None:
        personality = random.choice(list(AI_PERSONALITIES.keys()))

    if personality not in AI_PERSONALITIES:
        raise ValueError(f"Unknown personality: {personality}. Available: {list(AI_PERSONALITIES.keys())}")

    config = AI_PERSONALITIES[personality]

    # Try to get prediction from appropriate AI service, with graceful fallback
    raw_prediction = None
    try:
        if config["client_type"] == "anthropic":
            raw_prediction = await _get_claude_prediction(market, current_price, personality)
        elif config["client_type"] == "openai":
            raw_prediction = await _get_openai_prediction(market, current_price, personality)
        else:  # groq
            raw_prediction = await _get_groq_prediction(market, current_price, personality)
    except Exception as e:
        logger.warning(f"AI service failed for {personality}, using mock: {e}")
        # Fallback to mock prediction
        raw_prediction = _get_mock_prediction(config)

    if not raw_prediction:
        raw_prediction = _get_mock_prediction(config)

    # Build AIPrediction response
    personality_obj = AIPersonality(
        name=config["name"],
        style=config["style"],
        model=config["model"],
        confidence=float(raw_prediction.get("confidence", config["confidence_base"])),
    )

    return AIPrediction(
        direction=raw_prediction.get("direction", "UP").upper(),
        confidence=float(raw_prediction.get("confidence", config["confidence_base"])),
        reasoning=raw_prediction.get("reasoning", "Unable to generate reasoning."),
        personality=personality_obj,
    )


def _get_mock_prediction(config: dict) -> dict:
    """Generate a mock prediction when API fails."""
    import random

    directions = ["UP", "DOWN"]
    direction = random.choice(directions)
    base_confidence = config.get("confidence_base", 0.7)
    confidence = base_confidence + random.uniform(-0.15, 0.15)
    confidence = max(0.5, min(1.0, confidence))  # Clamp to 0.5-1.0

    style = config.get("style", "Balanced")
    if style == "Aggressive":
        reasoning = (
            f"Market momentum suggests a strong {direction} move in the near term based on recent volatility patterns."
        )
    elif style == "Cautious":
        reasoning = (
            f"Evidence suggests a possible {direction} move, but significant uncertainty remains. Proceed with caution."
        )
    else:  # Balanced
        reasoning = f"Technical and fundamental indicators point to a {direction} direction, with moderate conviction."

    return {
        "direction": direction,
        "confidence": confidence,
        "reasoning": reasoning,
    }
