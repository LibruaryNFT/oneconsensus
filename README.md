# OnePredict Arena

**AI vs Human Prediction Battles on OneChain**

Battle AI opponents to predict crypto price movements. Stake tokens, outsmart AI personalities, earn rewards. Built for OneHack 3.0.

## How It Works

1. **Pick a market** — BTC, ETH, SOL, or OCT
2. **Face an AI opponent** — Choose from "Claude Aggressive", "GPT Cautious", or "Llama Balanced"
3. **Both predict** — Will the price go UP or DOWN in the next 5 minutes?
4. **AI shows reasoning** — See the AI's analysis and confidence level
5. **Outcome resolves** — Real price checked, winner takes the pot
6. **Climb the leaderboard** — Track your wins, streaks, and earnings

## Tech Stack

- **Smart Contracts**: Move (OneChain / Sui fork)
- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI (Python), Claude/GPT/Llama AI engines
- **Price Data**: CoinGecko API + OneDEX integration
- **Wallet**: OneWallet via @onelabs/dapp-kit

## OneChain Integration

| Product | Integration |
|---------|-------------|
| OnePredict | Core prediction engine for market outcomes |
| OneWallet | Player authentication + staking + rewards |
| OneDEX | Real-time price feeds for prediction markets |
| OneID | Player profiles and identity |
| OnePlay | Gamification and achievement system |

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Add your API keys
uvicorn app:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

### Contracts
```bash
cd contracts
one move build
one move test
one move publish --network testnet
```

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Frontend   │────▶│   Backend    │────▶│  AI Models    │
│  Next.js 15  │     │   FastAPI    │     │ Claude/GPT/   │
│  OneWallet   │     │  Price Feed  │     │ Llama         │
└──────┬───────┘     └──────────────┘     └───────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│  OneChain    │────▶│  OneDEX      │
│  Contracts   │     │  Price Feed  │
│  (Move)      │     └──────────────┘
└──────────────┘
```

## AI Personalities

- **Claude Aggressive** 🔥 — High risk, bold calls. "I see a breakout forming..."
- **GPT Cautious** 🛡️ — Conservative, hedges. "The indicators suggest modest movement..."
- **Llama Balanced** ⚖️ — Data-driven, moderate. "Based on volume and momentum..."

## License

MIT

## Hackathon

Built for [OneHack 3.0 | AI & GameFi Edition](https://dorahacks.io/hackathon/onehackathon) on DoraHacks.
