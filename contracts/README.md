# OnePredict Arena — Move Smart Contracts

OneChain (Sui fork) Move contracts for AI vs Human prediction battle game.

## Structure

```
contracts/
├── Move.toml                          # Project config (OneChain edition)
└── sources/
    ├── prediction_pool.move           # Core game logic (159 lines)
    ├── leaderboard.move               # Player stats tracking (113 lines)
    └── rewards.move                   # ARENA token system (79 lines)
```

## Contracts

### 1. prediction_pool.move
Core game engine for prediction battles.

**Key Structs:**
- `PredictionPool<T>` — Prediction round (market, start/end price, duration, status)
- `Prediction` — Individual player prediction (player, direction, amount, timestamp)

**Entry Functions:**
- `create_pool()` — Admin creates new prediction round
- `make_prediction()` — Player stakes and predicts (UP or DOWN)
- `resolve_pool()` — Admin resolves with end price and emits result

**Events:**
- `PoolCreated` — New pool created
- `PredictionMade` — Player made a prediction
- `PoolResolved` — Pool resolved with final price

**Helpers:**
- `get_direction()` — Determine UP/DOWN from price change
- `pool_is_open()` — Check if pool accepting predictions
- `get_total_predictions()` — Get prediction count

### 2. leaderboard.move
Player statistics and ranking system.

**Key Structs:**
- `PlayerStats` — Player record (wins, losses, streak, best_streak, total_earned)
- `Leaderboard` — Main leaderboard object with player stats table

**Public Functions:**
- `create_leaderboard()` — Initialize leaderboard
- `record_result()` — Record win/loss and update streaks
- `get_stats()` — Retrieve player stats
- `player_exists()` — Check if player on board
- `total_players()` — Get player count

**Events:**
- `ResultRecorded` — Win/loss recorded with amounts

### 3. rewards.move
ARENA fungible token for game rewards.

**Key Structs:**
- `ARENA` — Token witness
- `AdminCap` — Admin capability for minting
- `Treasury` — Treasury holding minting powers and supply

**Public Functions:**
- `mint_reward()` — Admin mints ARENA to recipient
- `burn_tokens()` — Burn ARENA tokens
- `supply()` — Get current supply balance

## Compilation

```bash
# Requires OneChain Move CLI (Sui fork)
sui move build

# Run tests
sui move test
```

## Usage Flow

1. **Admin creates pool:** `create_pool("BTC/USD", 45000, 3600)`
2. **Players predict:** `make_prediction(pool, UP, coin)`
3. **Pool resolves:** `resolve_pool(pool, 46000)`
4. **Winners tracked:** `record_result(leaderboard, player, true, 100)`
5. **Rewards given:** `mint_reward(admin_cap, player, 50)`

## Design Notes

- **Generic pools:** `PredictionPool<T>` supports any fungible token (USDC, FLOW, etc.)
- **Event-driven:** All state changes emit events for indexing
- **Simple math:** No complex reward calculations (admin-driven distribution)
- **Hackathon scope:** Minimal validation, focus on core mechanics
- **OneChain compatible:** Uses `one::*` framework modules (Sui fork)

## Next Steps (Production)

- Add automatic reward distribution logic
- Implement dispute/appeal mechanism
- Add merkle proof verification for large payouts
- Integrate oracle for price feeds
- Add access controls and multi-sig admin
- Implement fee splits (platform, liquidity provider)
