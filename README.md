# Gemini Racing Spreadsheet

A browser-based racing performance analytics spreadsheet built with vanilla JavaScript, HTML, and CSS.

## Features

- **Selections Log** — Track all your race selections with date, course, horse name, odds, bet type, and results
- **Analytics Dashboard** — View real-time performance metrics:
  - Overall performance summary (total bets, staked, returns, P/L, ROI, win rate, strike rate)
  - 7-day rolling performance audit
  - Tier profitability breakdown (Primary, Secondary, Chaos)
- **Persistent Storage** — Your data is saved locally in your browser
- **Live URL** — Access from anywhere via GitHub Pages

## Getting Started

### Online (GitHub Pages)

The app is hosted live at:
**https://deanoooh.github.io/Gemini-Racing-Spreadsheet/**

Just open the link in your browser and start tracking!

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/deanoooh/Gemini-Racing-Spreadsheet.git
   cd Gemini-Racing-Spreadsheet
   ```

2. Open `index.html` in your browser (no build process needed)

## How It Works

- **Add rows** — Click "+ Add row" to add a new selection
- **Edit fields** — Click any cell to edit date, course, odds, stake, result, return, etc.
- **Automatic calculations** — P/L is calculated as Return - Stake for each row
- **Dashboard updates** — Metrics recalculate in real-time as you update data
- **Load sample** — Click "Load sample" to populate with example data
- **Reset** — Click "Reset" to clear all data and start fresh

## Formula Logic

All calculations mirror the original Google Sheets formulas:

- **Total Bets** — `COUNTA(horseName)` — count of non-empty horse names
- **Total Staked** — `SUM(stake)` — sum of all stakes
- **Total Returns** — `SUM(return)` — sum of all returns
- **Net P/L** — `SUM(pnl)` — sum of individual P/L values
- **Overall ROI** — `IF(staked > 0, pnl / staked, 0)` — percentage return on investment
- **Win Rate** — `IF(total > 0, wins / total, 0)` — percentage of "Won" results
- **Strike Rate** — `IF(total > 0, (wins + placed) / total, 0)` — percentage of "Won" + "Placed"
- **7-Day Metrics** — Filtered by date within last 7 days
- **Tier ROI** — Per-tier breakdown of profitability

## Data Storage

Your data is stored in your browser's **localStorage** under the key `gemini-racing-spreadsheet-v1`. It persists across sessions and will not be deleted unless you click "Reset" or manually clear browser data.

## Technologies

- **HTML5** — Semantic markup
- **CSS3** — Responsive styling with CSS variables
- **Vanilla JavaScript** — No dependencies, runs entirely in the browser

## Browser Support

Works in all modern browsers that support:
- localStorage
- ES6 JavaScript
- CSS Grid and Flexbox

## Future Enhancements

- Export to CSV/Excel
- Import from file
- Graph visualizations
- Advanced filtering and sorting
- Data backup/sync

## License

Open source — feel free to use, modify, and distribute.

---

**Questions or feedback?** Feel free to open an issue on GitHub.
