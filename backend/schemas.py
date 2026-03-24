"""Pydantic models for OneConsensus RWA risk assessment platform."""

from typing import Literal

from pydantic import BaseModel, Field


# ===== Legacy Models (Backward Compatibility) =====
class PredictionRequest(BaseModel):
    """User prediction submission (legacy)."""

    market: str = Field(..., description="Crypto market (BTC, ETH, SOL, OCT)")
    direction: Literal["UP", "DOWN"] = Field(..., description="Price direction prediction")
    timeframe: int = Field(default=300, description="Seconds to wait before resolving (default 5 min)")


class AIPersonality(BaseModel):
    """AI opponent personality and metadata."""

    name: str = Field(..., description="Personality name (The Auditor, The Risk Officer, The Arbitrator)")
    style: str = Field(..., description="Assessment style (Yield-Focused, Risk-Focused, Balanced)")
    model: str = Field(..., description="LLM model used")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Base confidence level")


class AIPrediction(BaseModel):
    """AI prediction result (legacy)."""

    direction: Literal["UP", "DOWN"] = Field(..., description="Predicted price direction")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score (0-1)")
    reasoning: str = Field(..., description="2-3 sentence explanation of prediction")
    personality: AIPersonality = Field(..., description="Which AI personality made this prediction")


class BattleResult(BaseModel):
    """Resolved battle outcome (legacy)."""

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


# ===== New OneConsensus Models =====
class RWAAsset(BaseModel):
    """Real-world asset for risk assessment."""

    id: str = Field(..., description="Unique asset identifier")
    name: str = Field(..., description="Asset name (e.g., 'Medellin Tech Hub')")
    asset_type: str = Field(
        ...,
        description="Type of asset (Commercial Real Estate, Agricultural Land, Residential, Energy, Maritime, Commodities, etc.)",
    )
    location: str = Field(..., description="Geographic location")
    estimated_value: float = Field(..., gt=0, description="Estimated asset value in USD")
    yield_rate: float = Field(..., ge=0.0, le=100.0, description="Annual yield percentage (0-100)")
    description: str = Field(..., description="Detailed description of the asset")
    risk_factors: list[str] = Field(default_factory=list, description="Known risk factors")


class RiskAssessment(BaseModel):
    """AI assessment of an RWA asset."""

    agent_name: str = Field(..., description="Name of the AI agent (The Auditor, The Risk Officer, The Arbitrator)")
    risk_score: int = Field(..., ge=1, le=100, description="Risk score from 1 (lowest risk) to 100 (highest risk)")
    collateral_ratio: float = Field(..., gt=0.0, description="Recommended collateral ratio (e.g., 135.5 = 135.5%)")
    valuation: float = Field(..., gt=0, description="Agent's valuation estimate in USD")
    reasoning: str = Field(..., description="2-3 paragraph detailed reasoning and analysis")
    risks: list[str] = Field(..., description="Key risks identified by this agent")
    opportunities: list[str] = Field(..., description="Key opportunities identified by this agent")


class ConsensusResult(BaseModel):
    """Final consensus from the AI committee."""

    asset: RWAAsset = Field(..., description="The asset being assessed")
    assessments: list[RiskAssessment] = Field(..., description="Individual assessments from all three agents")
    final_risk_score: float = Field(..., ge=1.0, le=100.0, description="Final consensus risk score")
    final_collateral_ratio: float = Field(..., gt=0.0, description="Final consensus collateral ratio")
    final_valuation: float = Field(..., gt=0, description="Final consensus valuation in USD")
    consensus_reasoning: str = Field(..., description="Synthesis of all three perspectives")
    debate_summary: str = Field(..., description="Summary of where agents agreed and disagreed")
    recommendation: str = Field(
        ..., description="Final recommendation (Strong Buy, Buy, Hold, Caution, Strong Caution)"
    )
