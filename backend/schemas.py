"""Pydantic models for OnePredict Arena API."""

from pydantic import BaseModel, Field
from typing import Literal


class PredictionRequest(BaseModel):
    """User prediction submission."""

    market: str = Field(..., description="Crypto market (BTC, ETH, SOL, OCT)")
    direction: Literal["UP", "DOWN"] = Field(..., description="Price direction prediction")
    timeframe: int = Field(default=300, description="Seconds to wait before resolving (default 5 min)")


class AIPersonality(BaseModel):
    """AI opponent personality and metadata."""

    name: str = Field(..., description="Personality name (Claude Aggressive, GPT Cautious, Llama Balanced)")
    style: str = Field(..., description="Prediction style (Aggressive, Cautious, Balanced)")
    model: str = Field(..., description="LLM model used")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Base confidence level")


class AIPrediction(BaseModel):
    """AI prediction result."""

    direction: Literal["UP", "DOWN"] = Field(..., description="Predicted price direction")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score (0-1)")
    reasoning: str = Field(..., description="2-3 sentence explanation of prediction")
    personality: AIPersonality = Field(..., description="Which AI personality made this prediction")


class BattleResult(BaseModel):
    """Resolved battle outcome."""

    battle_id: str = Field(..., description="Unique battle identifier")
    market: str = Field(..., description="Market symbol (BTC, ETH, SOL, OCT)")
    timeframe: int = Field(..., description="Timeframe in seconds")
    price_start: float = Field(..., description="Starting price")
    price_end: float = Field(..., description="Ending price after timeframe")
    actual_direction: str = Field(..., description="Actual direction (UP or DOWN)")
    player_prediction: str = Field(..., description="Player's prediction (UP or DOWN)")
    player_won: bool = Field(..., description="Whether player beat the AI")
    ai_prediction: AIPrediction = Field(..., description="AI's prediction")
    ai_won: bool = Field(..., description="Whether AI's prediction was correct")
