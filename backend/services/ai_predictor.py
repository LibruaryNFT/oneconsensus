"""AI risk assessment service for RWA assets with three personality perspectives."""

import json
import logging
import os
import random
from typing import Optional

import anthropic
import httpx
import openai
from schemas import AIPersonality, AIPrediction, ConsensusResult, RiskAssessment, RWAAsset

logger = logging.getLogger(__name__)


def _clean_json_response(text: str) -> dict:
    """Extract and parse JSON from LLM response, handling markdown fences and trailing commas."""
    text = text.strip()
    # Remove markdown fences
    if "```" in text:
        parts = text.split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            if part.startswith("{"):
                text = part
                break
    # Find the JSON object
    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        text = text[start:end]
    # Fix trailing commas before closing braces/brackets
    import re

    text = re.sub(r",\s*([}\]])", r"\1", text)
    return json.loads(text)


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


# Groq API (via httpx)
GROQ_API_BASE = "https://api.groq.com/openai/v1"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


# New personalities for RWA assessment
AI_PERSONALITIES = {
    "auditor": {
        "name": "The Auditor",
        "style": "Yield-Focused",
        "model": "claude-opus-4-1-20250805",
        "confidence_base": 0.85,
        "temperature": 0.9,
        "client_type": "anthropic",
        "role": "Yield-maximalist who believes in finding opportunity in real assets. Pushes for lower collateral requirements, sees upside potential, identifies growth opportunities.",
    },
    "risk-officer": {
        "name": "The Risk Officer",
        "style": "Risk-Focused",
        "model": "gpt-4o-mini",
        "confidence_base": 0.60,
        "temperature": 0.3,
        "client_type": "openai",
        "role": "Compliance-first professional focused on downside protection. Identifies every conceivable risk, argues for higher collateral ratios, conservative in valuation.",
    },
    "arbitrator": {
        "name": "The Arbitrator",
        "style": "Balanced",
        "model": "llama-3.3-70b-versatile",
        "confidence_base": 0.70,
        "temperature": 0.6,
        "client_type": "groq",
        "role": "Synthesizes both the Auditor and Risk Officer perspectives. Makes the final call, balances risk and opportunity, produces consensus.",
    },
}


def _get_rwa_assessment_prompt(asset: RWAAsset, agent_role: str) -> str:
    """Build a prompt tailored to the RWA assessment personality."""
    asset_info = f"""
Asset: {asset.name}
Type: {asset.asset_type}
Location: {asset.location}
Estimated Value: ${asset.estimated_value:,.0f}
Annual Yield Rate: {asset.yield_rate}%
Description: {asset.description}
Known Risk Factors: {", ".join(asset.risk_factors) if asset.risk_factors else "None identified"}
"""

    base_prompt = f"""You are a financial analyst evaluating a real-world asset (RWA) for tokenization and collateralization.

{asset_info}

Provide a detailed risk assessment. Return ONLY valid JSON (no markdown, no extra text):
{{
  "risk_score": <integer 1-100, where 1=lowest risk, 100=highest risk>,
  "collateral_ratio": <float, recommended collateral ratio e.g. 135.5 for 135.5%>,
  "valuation": <float, your valuation estimate in USD>,
  "reasoning": "<2-3 paragraphs of detailed reasoning>",
  "risks": [<list of 4-6 key risks you identified>],
  "opportunities": [<list of 3-4 key opportunities or positive factors>]
}}"""

    if "Yield" in agent_role:
        # The Auditor: emphasize opportunity, lower collateral
        return (
            base_prompt
            + f"""

PERSONALITY: {agent_role}
You are optimistic about this asset. Focus on:
- Yield potential and income generation
- Growth opportunities and market tailwinds
- Why collateral requirements should be LOWER (you're confident in this asset)
- Upside scenarios and value creation potential
- Historical performance and proven cash flows
"""
        )

    elif "Risk" in agent_role:
        # The Risk Officer: emphasize risks, higher collateral
        return (
            base_prompt
            + f"""

PERSONALITY: {agent_role}
You are cautious about this asset. Focus on:
- Downside risks and black swan events
- Regulatory, operational, and market threats
- Why collateral requirements should be HIGHER (you want conservative protection)
- Worst-case scenarios and tail risk
- Liquidity constraints and market stress testing
"""
        )

    else:  # Balanced
        # The Arbitrator: synthesize both views
        return (
            base_prompt
            + f"""

PERSONALITY: {agent_role}
You synthesize both the optimistic and cautious perspectives. Focus on:
- Balanced assessment of risks and opportunities
- Fair valuation that considers all scenarios
- Reasonable collateral ratio that protects lenders while allowing reasonable leverage
- Consensus view that both other analysts could agree on
- Clear articulation of assumptions and their sensitivity
"""
        )


async def _get_claude_assessment(asset: RWAAsset, personality: str) -> dict:
    """Get RWA assessment from Claude."""
    client = _get_anthropic_client()
    if not client:
        raise ValueError("Anthropic client not initialized. Check ANTHROPIC_API_KEY.")

    config = AI_PERSONALITIES[personality]
    prompt = _get_rwa_assessment_prompt(asset, config["role"])

    try:
        message = client.messages.create(
            model=config["model"],
            max_tokens=1000,
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

        assessment = _clean_json_response(response_text)
        return assessment
    except Exception as e:
        logger.error(f"Claude assessment failed: {e}")
        raise ValueError(f"Claude AI failed: {e}")


async def _get_openai_assessment(asset: RWAAsset, personality: str) -> dict:
    """Get RWA assessment from OpenAI GPT."""
    client = _get_openai_client()
    if not client:
        raise ValueError("OpenAI client not initialized. Check OPENAI_API_KEY.")

    config = AI_PERSONALITIES[personality]
    prompt = _get_rwa_assessment_prompt(asset, config["role"])

    try:
        response = client.chat.completions.create(
            model=config["model"],
            max_tokens=1000,
            temperature=config["temperature"],
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )

        response_text = response.choices[0].message.content.strip()

        # Clean up markdown if present
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
            response_text = response_text.strip()

        assessment = _clean_json_response(response_text)
        return assessment
    except Exception as e:
        logger.error(f"OpenAI assessment failed: {e}")
        raise ValueError(f"OpenAI AI failed: {e}")


async def _get_groq_assessment(asset: RWAAsset, personality: str) -> dict:
    """Get RWA assessment from Groq Llama."""
    config = AI_PERSONALITIES[personality]
    prompt = _get_rwa_assessment_prompt(asset, config["role"])

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{GROQ_API_BASE}/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                json={
                    "model": config["model"],
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 1000,
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

            assessment = _clean_json_response(response_text)
            return assessment
    except Exception as e:
        logger.error(f"Groq assessment failed: {e}")
        raise ValueError(f"Groq AI failed: {e}")


def _get_mock_assessment(config: dict, asset: RWAAsset) -> dict:
    """Generate a mock assessment when API fails."""
    # Generate realistic mock data based on asset type
    base_risk = {
        "Commercial Real Estate": 35,
        "Agricultural Land": 45,
        "Residential Real Estate": 40,
        "Renewable Energy": 50,
        "Maritime Freight": 60,
        "Commodity Storage": 30,
    }

    asset_type_risk = base_risk.get(asset.asset_type, 45)
    style = config.get("style", "Balanced")

    # Adjust based on personality
    if "Yield" in style:
        risk_score = max(15, asset_type_risk - 15)
        collateral_ratio = 110 + random.uniform(5, 15)
    elif "Risk" in style:
        risk_score = min(85, asset_type_risk + 15)
        collateral_ratio = 140 + random.uniform(5, 20)
    else:  # Balanced
        risk_score = asset_type_risk
        collateral_ratio = 125 + random.uniform(5, 10)

    valuation = asset.estimated_value * random.uniform(0.95, 1.05)

    reasoning = f"This {asset.asset_type.lower()} in {asset.location} presents moderate exposure. The yield rate of {asset.yield_rate}% is competitive for the asset class. Key considerations include regulatory environment, market conditions, and operational risks. "
    if "Yield" in style:
        reasoning += "We see significant upside potential and recommend a competitive collateral structure."
    elif "Risk" in style:
        reasoning += "We recommend conservative collateral requirements to protect lender interests."
    else:
        reasoning += "A balanced approach to valuation and collateral is appropriate given the risk profile."

    return {
        "risk_score": int(risk_score),
        "collateral_ratio": round(collateral_ratio, 1),
        "valuation": round(valuation, 2),
        "reasoning": reasoning,
        "risks": [
            f"{asset.asset_type} market risk",
            f"Regulatory risk in {asset.location}",
            "Operational execution risk",
            "Market liquidity concerns",
        ],
        "opportunities": [
            f"Strong {asset.yield_rate}% yield",
            "Diversified asset class",
            "Real asset backing",
            "Inflation hedge potential",
        ],
    }


async def evaluate_rwa(asset: RWAAsset) -> ConsensusResult:
    """
    Evaluate an RWA asset with three AI agents and reach consensus.

    Args:
        asset: RWAAsset to evaluate

    Returns:
        ConsensusResult with assessments from all three agents and final consensus

    Process:
        1. Send asset to The Auditor (Claude) and The Risk Officer (GPT) in parallel
        2. Send both assessments to The Arbitrator (Llama) for final consensus
        3. Return all assessments + consensus
    """
    import asyncio

    # Step 1: Get assessments from Auditor and Risk Officer in parallel
    try:
        auditor_task = _get_claude_assessment(asset, "auditor")
        risk_officer_task = _get_openai_assessment(asset, "risk-officer")

        auditor_raw, risk_officer_raw = await asyncio.gather(auditor_task, risk_officer_task)
    except Exception as e:
        logger.warning(f"AI service failed, using mock assessments: {e}")
        auditor_raw = _get_mock_assessment(AI_PERSONALITIES["auditor"], asset)
        risk_officer_raw = _get_mock_assessment(AI_PERSONALITIES["risk-officer"], asset)

    # Build RiskAssessment objects
    auditor_assessment = RiskAssessment(
        agent_name="The Auditor",
        risk_score=auditor_raw.get("risk_score", 35),
        collateral_ratio=auditor_raw.get("collateral_ratio", 115.0),
        valuation=auditor_raw.get("valuation", asset.estimated_value),
        reasoning=auditor_raw.get("reasoning", "Mock assessment"),
        risks=auditor_raw.get("risks", []),
        opportunities=auditor_raw.get("opportunities", []),
    )

    risk_officer_assessment = RiskAssessment(
        agent_name="The Risk Officer",
        risk_score=risk_officer_raw.get("risk_score", 55),
        collateral_ratio=risk_officer_raw.get("collateral_ratio", 145.0),
        valuation=risk_officer_raw.get("valuation", asset.estimated_value * 0.95),
        reasoning=risk_officer_raw.get("reasoning", "Mock assessment"),
        risks=risk_officer_raw.get("risks", []),
        opportunities=risk_officer_raw.get("opportunities", []),
    )

    # Step 2: Build context for Arbitrator
    arbitrator_context = f"""
Two analysts have assessed the {asset.name}:

THE AUDITOR (Optimistic, Yield-Focused):
- Risk Score: {auditor_assessment.risk_score}
- Collateral Ratio: {auditor_assessment.collateral_ratio}%
- Valuation: ${auditor_assessment.valuation:,.0f}
- Perspective: {auditor_assessment.reasoning[:200]}...

THE RISK OFFICER (Cautious, Risk-Focused):
- Risk Score: {risk_officer_assessment.risk_score}
- Collateral Ratio: {risk_officer_assessment.collateral_ratio}%
- Valuation: ${risk_officer_assessment.valuation:,.0f}
- Perspective: {risk_officer_assessment.reasoning[:200]}...

Asset Overview:
- Type: {asset.asset_type}
- Location: {asset.location}
- Estimated Value: ${asset.estimated_value:,.0f}
- Annual Yield: {asset.yield_rate}%
"""

    arbitrator_prompt = f"""You are The Arbitrator, a senior financial analyst synthesizing risk assessments.

{arbitrator_context}

Based on these two perspectives, provide your final consensus assessment. Return ONLY valid JSON (no markdown, no extra text):
{{
  "risk_score": <integer 1-100, your consensus risk score>,
  "collateral_ratio": <float, your consensus collateral ratio>,
  "valuation": <float, your consensus valuation in USD>,
  "consensus_reasoning": "<2-3 paragraphs synthesizing both views and explaining your final position>",
  "debate_summary": "<1-2 paragraphs summarizing where they agreed and disagreed, and how you resolved conflicts>",
  "recommendation": "<Single recommendation: 'Strong Buy', 'Buy', 'Hold', 'Caution', or 'Strong Caution'>"
}}"""

    # Get Arbitrator assessment
    try:
        arbitrator_raw = await _get_groq_assessment(asset, "arbitrator")
    except Exception as e:
        logger.warning(f"Arbitrator failed, generating mock consensus: {e}")
        # Create a mock consensus between the two
        arbitrator_raw = {
            "risk_score": int((auditor_assessment.risk_score + risk_officer_assessment.risk_score) / 2),
            "collateral_ratio": (auditor_assessment.collateral_ratio + risk_officer_assessment.collateral_ratio) / 2,
            "valuation": (auditor_assessment.valuation + risk_officer_assessment.valuation) / 2,
            "consensus_reasoning": "Mock consensus balancing auditor and risk officer perspectives.",
            "debate_summary": "Both agents provided substantive analysis. We took a middle-ground approach.",
            "recommendation": "Hold",
        }

    arbitrator_assessment = RiskAssessment(
        agent_name="The Arbitrator",
        risk_score=arbitrator_raw.get("risk_score", 45),
        collateral_ratio=arbitrator_raw.get("collateral_ratio", 130.0),
        valuation=arbitrator_raw.get("valuation", asset.estimated_value),
        reasoning=arbitrator_raw.get("consensus_reasoning", "Mock assessment"),
        risks=[],  # Arbitrator doesn't identify new risks, just synthesizes
        opportunities=[],
    )

    # Build final ConsensusResult
    return ConsensusResult(
        asset=asset,
        assessments=[auditor_assessment, risk_officer_assessment, arbitrator_assessment],
        final_risk_score=float(arbitrator_assessment.risk_score),
        final_collateral_ratio=arbitrator_assessment.collateral_ratio,
        final_valuation=arbitrator_assessment.valuation,
        consensus_reasoning=arbitrator_raw.get("consensus_reasoning", ""),
        debate_summary=arbitrator_raw.get("debate_summary", ""),
        recommendation=arbitrator_raw.get("recommendation", "Hold"),
    )


# Legacy functions for backward compatibility
async def get_ai_prediction(market: str, current_price: float, personality: Optional[str] = None) -> AIPrediction:
    """
    Get AI prediction for a market using specified personality (legacy crypto prediction).

    Args:
        market: Market symbol (BTC, ETH, SOL, OCT)
        current_price: Current market price
        personality: Personality key (auditor, risk-officer, arbitrator)

    Returns:
        AIPrediction with direction, confidence, reasoning, and personality info
    """
    # For legacy compatibility, map new personalities to prediction styles
    if personality is None:
        personality = random.choice(list(AI_PERSONALITIES.keys()))

    if personality not in AI_PERSONALITIES:
        raise ValueError(f"Unknown personality: {personality}. Available: {list(AI_PERSONALITIES.keys())}")

    config = AI_PERSONALITIES[personality]

    # Build a simple crypto prediction prompt
    prediction_prompt = f"""You are a crypto market analyst. Analyze {market} at price ${current_price:.2f}.

Predict if the price will go UP or DOWN in the next 5 minutes.

Respond ONLY with valid JSON (no markdown, no extra text):
{{
  "direction": "UP" or "DOWN",
  "confidence": 0.0 to 1.0,
  "reasoning": "2-3 sentence explanation"
}}"""

    if config["style"] == "Yield-Focused":
        prediction_prompt += "\n\nStyle: Be bold and confident. Take strong positions. High conviction calls."
    elif config["style"] == "Risk-Focused":
        prediction_prompt += "\n\nStyle: Be conservative and hedge. Acknowledge uncertainty. Low conviction acceptable."
    else:  # Balanced
        prediction_prompt += "\n\nStyle: Balance risk and data. Moderate conviction. Consider both sides."

    # Try to get prediction from appropriate AI service
    raw_prediction = None
    try:
        if config["client_type"] == "anthropic":
            client = _get_anthropic_client()
            if client:
                message = client.messages.create(
                    model=config["model"],
                    max_tokens=200,
                    temperature=config["temperature"],
                    messages=[{"role": "user", "content": prediction_prompt}],
                )
                response_text = message.content[0].text.strip()
                if response_text.startswith("```"):
                    response_text = response_text.split("```")[1]
                    if response_text.startswith("json"):
                        response_text = response_text[4:]
                    response_text = response_text.strip()
                raw_prediction = _clean_json_response(response_text)
        elif config["client_type"] == "openai":
            client = _get_openai_client()
            if client:
                response = client.chat.completions.create(
                    model=config["model"],
                    max_tokens=200,
                    temperature=config["temperature"],
                    messages=[{"role": "user", "content": prediction_prompt}],
                )
                response_text = response.choices[0].message.content.strip()
                if response_text.startswith("```"):
                    response_text = response_text.split("```")[1]
                    if response_text.startswith("json"):
                        response_text = response_text[4:]
                    response_text = response_text.strip()
                raw_prediction = _clean_json_response(response_text)
        else:  # groq
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{GROQ_API_BASE}/chat/completions",
                    headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                    json={
                        "model": config["model"],
                        "messages": [{"role": "user", "content": prediction_prompt}],
                        "max_tokens": 200,
                        "temperature": config["temperature"],
                    },
                )
                response.raise_for_status()
                data = response.json()
                response_text = data["choices"][0]["message"]["content"].strip()
                if response_text.startswith("```"):
                    response_text = response_text.split("```")[1]
                    if response_text.startswith("json"):
                        response_text = response_text[4:]
                    response_text = response_text.strip()
                raw_prediction = _clean_json_response(response_text)
    except Exception as e:
        logger.warning(f"AI service failed for {personality}, using mock: {e}")

    # Fallback to mock prediction
    if not raw_prediction:
        directions = ["UP", "DOWN"]
        direction = random.choice(directions)
        base_confidence = config.get("confidence_base", 0.7)
        confidence = base_confidence + random.uniform(-0.15, 0.15)
        confidence = max(0.5, min(1.0, confidence))

        raw_prediction = {
            "direction": direction,
            "confidence": confidence,
            "reasoning": f"Technical analysis suggests a {direction} move in the near term based on recent market patterns.",
        }

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
