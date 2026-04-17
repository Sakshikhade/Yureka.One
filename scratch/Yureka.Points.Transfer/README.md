# 🔁 Yureka Points Transfer Calculator

A beautiful, data-driven transfer calculator dashboard built on live points transfer data from [points.casa](https://points.casa/tools/transfer-calculator/).

## Features

- 🔍 **Smart Dropdowns** — Search and filter across 73 source programs
- 📊 **3,655 Transfer Combinations** — Direct (651) and multi-hop via intermediary programs
- ⚡ **Real-time Calculation** — Instant yield computation as you type points
- 🎯 **Precise Ratio Math** — Ratio strings (`2:1`, `50:13`) correctly parsed: `Yield = Transfer Points ÷ RatioFloat`
- 💰 **INR Estimation** — Estimated rupee value displayed alongside yield
- 🏨 / ✈️ **Category Filters** — Toggle between Airlines & Hotels
- 🔗 **Direct / Indirect Filters** — Show only direct transfers or multi-hop routes
- 📈 **Sort by Value** — Reorder results by highest yield

## Data Sources

- Transfer matrix scraped and computed from the live DOM at `points.casa`
- `points_transfer_matrix.csv` — Full matrix with 3,655 combinations
- `data.js` — Frontend-ready JSON array consumed directly by the browser

## How to Run

```bash
# Clone the repo
git clone https://github.com/toanweshbiswas/Yureka.Points.Transfer

cd Yureka.Points.Transfer

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

## Calculation Logic

```
Yield = Transfer Points ÷ Ratio Float

Example: 10,000 points with 2:1 ratio
  Ratio Float = 2.0
  Yield = 10,000 ÷ 2.0 = 5,000 points
```

For indirect (2-hop) transfers:
```
Combined Ratio Float = 1 / (Leg1_Multiplier × Leg2_Multiplier)
```

## Tech Stack

- Pure HTML / CSS / JavaScript (no frameworks)
- Python 3 (data scraping & matrix generation)
- Playwright (DOM scraping from live site)

## Project Structure

```
├── index.html              # Main dashboard UI
├── styles.css              # Premium glassmorphism styling
├── main.js                 # App logic, filters, rendering
├── data.js                 # Generated JS dataset (3,655 rows)
├── Yureka_Points to Rewards - points_transfer_matrix.csv
├── refine_math.py          # Master data pipeline script
├── compute_combinations.py # 2-hop path generator
└── extract_programs.py     # Scraper helpers
```
