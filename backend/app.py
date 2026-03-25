"""FastAPI app for OneConsensus - RWA Risk Assessment Platform."""

import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import (
    ConsensusResult,
)
from services.ai_predictor import evaluate_rwa
from services.rwa_assets import get_asset_by_id, get_sample_assets

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
    logger.info("OneConsensus - RWA Risk Assessment Platform starting...")
    yield
    logger.info("OneConsensus - RWA Risk Assessment Platform shutting down...")


# Create FastAPI app
app = FastAPI(
    title="OneConsensus",
    description="AI-powered RWA (Real-World Asset) risk assessment platform. Three AI agents debate and reach consensus on asset risk, valuation, and collateral requirements.",
    version="2.0.0",
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
    return {"status": "ok", "service": "OneConsensus - RWA Risk Assessment Platform"}


# === RWA Asset Endpoints (NEW OneConsensus) ===
@app.get("/api/assets")
async def list_assets():
    """
    List all available RWA assets for evaluation.

    Returns:
        List of RWAAsset objects with ID, name, type, location, value, yield
    """
    assets = get_sample_assets()
    return {
        "total": len(assets),
        "assets": [
            {
                "id": asset.id,
                "name": asset.name,
                "asset_type": asset.asset_type,
                "location": asset.location,
                "estimated_value": asset.estimated_value,
                "yield_rate": asset.yield_rate,
                "description": asset.description[:150] + "...",  # Truncate for list view
            }
            for asset in assets
        ],
    }


@app.get("/api/assets/{asset_id}")
async def get_asset(asset_id: str):
    """
    Get full details of a specific RWA asset.

    Args:
        asset_id: Unique asset identifier

    Returns:
        Full RWAAsset object with all details
    """
    asset = get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail=f"Asset {asset_id} not found")
    return asset


@app.post("/api/evaluate")
async def evaluate_asset(asset_id: str) -> ConsensusResult:
    """
    Evaluate an RWA asset with three AI agents and get consensus recommendation.

    This is the core endpoint of OneConsensus:
    1. The Auditor (Claude) provides yield-focused optimistic assessment
    2. The Risk Officer (GPT) provides risk-focused conservative assessment
    3. The Arbitrator (Llama) synthesizes both and makes final recommendation

    Args:
        asset_id: Unique asset identifier (from /api/assets)

    Returns:
        ConsensusResult with:
        - Individual risk assessments from all three agents
        - Final consensus risk score, collateral ratio, and valuation
        - Debate summary showing where agents agreed/disagreed
        - Final recommendation (Strong Buy, Buy, Hold, Caution, Strong Caution)

    Example:
        curl -X POST "http://localhost:8000/api/evaluate?asset_id=medellin-tech-hub"
    """
    try:
        asset = get_asset_by_id(asset_id)
        if not asset:
            raise HTTPException(status_code=404, detail=f"Asset {asset_id} not found")

        logger.info(f"Evaluating asset: {asset.name}")

        # Run the three-agent consensus evaluation
        consensus = await evaluate_rwa(asset)

        logger.info(f"Evaluation complete for {asset.name}. Recommendation: {consensus.recommendation}")
        return consensus

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Asset evaluation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


@app.get("/api/agents")
async def list_agents():
    """
    List the three AI agents and their roles.

    Returns:
        Information about The Auditor, The Risk Officer, and The Arbitrator
    """
    agents = [
        {
            "id": "auditor",
            "name": "The Auditor",
            "style": "Yield-Focused",
            "model": "claude-opus-4-1-20250805",
            "role": "Identifies opportunities and growth potential. Pushes for competitive collateral ratios.",
            "strengths": ["Yield analysis", "Growth scenarios", "Upside identification"],
        },
        {
            "id": "risk-officer",
            "name": "The Risk Officer",
            "style": "Risk-Focused",
            "model": "gpt-4o-mini",
            "role": "Identifies risks and downside scenarios. Recommends conservative collateral ratios.",
            "strengths": ["Risk identification", "Compliance", "Downside protection"],
        },
        {
            "id": "arbitrator",
            "name": "The Arbitrator",
            "style": "Balanced",
            "model": "llama-3.1-70b-versatile",
            "role": "Synthesizes both perspectives and produces final consensus recommendation.",
            "strengths": ["Synthesis", "Balanced assessment", "Final decision-making"],
        },
    ]

    return {"agents": agents, "message": "Submit an asset_id to /api/evaluate to get their consensus"}


# === Root endpoint ===
@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "service": "OneConsensus - RWA Risk Assessment Platform",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "list_assets": "GET /api/assets — List all RWA assets",
            "get_asset": "GET /api/assets/{asset_id} — Get asset details",
            "evaluate": "POST /api/evaluate?asset_id=... — Get 3-agent consensus evaluation",
            "list_agents": "GET /api/agents — List the 3 AI agents",
        },
        "quick_start": {
            "step_1": "GET /api/assets",
            "step_2": "GET /api/assets/{id} to see full details",
            "step_3": "POST /api/evaluate?asset_id={id} to get AI consensus",
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
