"""RWA asset catalog and management service."""

from typing import Dict, Optional

from schemas import RWAAsset

# Sample RWA assets for demonstration
SAMPLE_ASSETS: Dict[str, RWAAsset] = {
    "medellin-tech-hub": RWAAsset(
        id="medellin-tech-hub",
        name="Medellin Tech Hub",
        asset_type="Commercial Real Estate",
        location="Medellin, Colombia",
        estimated_value=2400000,
        yield_rate=7.2,
        description="Modern 12,000 sqft commercial office building in the heart of Medellin's tech district. Recently renovated with open floor plans, high-speed fiber internet, and rooftop solar panels. Home to 15+ tech startups and design agencies. Long-term occupancy (8+ years) with inflation-linked rent escalation.",
        risk_factors=[
            "Currency volatility (COP/USD)",
            "Colombian regulatory changes in commercial zoning",
            "Tenant concentration risk (tech sector downturn)",
            "Maintenance costs in tropical climate",
            "Political risk in emerging market",
        ],
    ),
    "costa-rica-coffee-farm": RWAAsset(
        id="costa-rica-coffee-farm",
        name="Costa Rica Coffee Farm",
        asset_type="Agricultural Land",
        location="San Isidro de El General, Costa Rica",
        estimated_value=890000,
        yield_rate=5.8,
        description="85-hectare premium coffee plantation in Costa Rica's Central Valley. Produces specialty arabica beans with direct-to-buyer contracts worth ~$51,620/year. Established trees (15+ years) with sustainable farming practices. Water rights included. Farm generates 4x the Costa Rican minimum wage annually.",
        risk_factors=[
            "Commodity price volatility (coffee prices)",
            "Climate risk (drought, frost, flooding)",
            "Labor availability in rural areas",
            "Pest and disease pressures",
            "Illiquidity (takes 6-12 months to sell)",
        ],
    ),
    "miami-beach-condo": RWAAsset(
        id="miami-beach-condo",
        name="Miami Beach Condo",
        asset_type="Residential Real Estate",
        location="Miami Beach, Florida, USA",
        estimated_value=1800000,
        yield_rate=4.5,
        description="Luxury 3-bedroom, 3-bathroom oceanfront condo in Miami Beach. Built 2018 with high-end finishes, concierge service, and building amenities including gym, pool, and valet. Currently leased to long-term tenant at $7,500/month ($90,000/year). HOA fees ~$750/month. Strong hurricane insurance.",
        risk_factors=[
            "Hurricane and flooding risk",
            "Florida property insurance costs rising",
            "HOA fee increases",
            "Tenant turnover risk",
            "Miami real estate market cyclicality",
            "Sea level rise concerns (long-term)",
        ],
    ),
    "lagos-solar-farm": RWAAsset(
        id="lagos-solar-farm",
        name="Lagos Solar Farm",
        asset_type="Renewable Energy",
        location="Lagos State, Nigeria",
        estimated_value=3200000,
        yield_rate=9.1,
        description="5MW solar photovoltaic farm near Lagos with 25-year Power Purchase Agreement (PPA) at fixed ₦32/kWh. Generates ~6.2M kWh annually (~$290,000/year). Equipment sourced from Tier-1 manufacturers with 25-year warranties. Interconnected to national grid with dedicated transformer.",
        risk_factors=[
            "Currency risk (Nigerian Naira volatility)",
            "Political instability in Nigeria",
            "Grid reliability and blackout risk",
            "Regulatory changes to renewable energy subsidies",
            "Equipment replacement costs (25-year horizon)",
            "Counterparty risk on PPA (government utility)",
        ],
    ),
    "singapore-cargo-ship": RWAAsset(
        id="singapore-cargo-ship",
        name="Singapore Cargo Ship",
        asset_type="Maritime Freight",
        location="Singapore (registered)",
        estimated_value=12000000,
        yield_rate=11.3,
        description="22-year-old general cargo ship (4,500 TEU capacity) with 10-year bareboat charter to Maersk. Generates $1.356M annually. Vessel inspected and approved for international trade through 2028. Located in high-demand Asia-Europe shipping lane. Well-maintained engine (last major overhaul 2021).",
        risk_factors=[
            "Shipping market cyclicality (rates volatile)",
            "Fuel price volatility",
            "Aging vessel (hull integrity concerns)",
            "Regulatory emissions standards (MARPOL, EU-MRV)",
            "Counterparty risk (Maersk credit)",
            "Piracy risk in certain sea lanes",
            "Insurance costs and availability",
        ],
    ),
    "dubai-gold-vault": RWAAsset(
        id="dubai-gold-vault",
        name="Dubai Gold Vault",
        asset_type="Commodity Storage",
        location="Dubai, United Arab Emirates",
        estimated_value=5500000,
        yield_rate=3.2,
        description="Vault storage facility containing 175,000 troy ounces of physical gold (23.8 metric tons) stored in a LBMA-certified facility. Insured through Lloyd's of London. Generates income through lease agreements with bullion dealers (+3.2%/year). Custody agreements with 5+ institutional clients. Gold bars meet .9999 fineness standard.",
        risk_factors=[
            "Geopolitical risk in Middle East",
            "UAE regulatory changes on precious metals",
            "Storage facility security (operational risk)",
            "Insurance premium increases",
            "Gold price volatility (market risk)",
            "Liquidity (selling bars takes time)",
            "Customer concentration risk",
        ],
    ),
}


def get_sample_assets() -> list[RWAAsset]:
    """
    Get all sample RWA assets.

    Returns:
        List of all sample RWAAsset objects
    """
    return list(SAMPLE_ASSETS.values())


def get_asset_by_id(asset_id: str) -> Optional[RWAAsset]:
    """
    Get a specific asset by ID.

    Args:
        asset_id: Unique asset identifier

    Returns:
        RWAAsset if found, None otherwise
    """
    return SAMPLE_ASSETS.get(asset_id)
