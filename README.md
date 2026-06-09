# Lambda Capital Internal Dashboard (LC Dashboard)

A premium, highly interactive internal trading dashboard for **Lambda Capital**. Designed with a luxury dark grey glassmorphic theme and orange accents (matching the corporate identity).

![Theme Accent](https://img.shields.io/badge/Theme-Glassmorphism-orange)
![Tech Stack](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JS-blue)
![Charts](https://img.shields.io/badge/Charts-Chart.js-green)

---

## Key Features

1. **Multi-Account State Management**:
   - Supports switching between multiple proprietary trading accounts: **FTMO** (10k, 100k #1, #2, #3, #4) and **The5ers** (5k).
   - Dynamic view switching including **Chứng khoán** (mock view) and **Tổng hợp** (aggregated metrics and performance table across all active accounts).

2. **12 Real-Time KPI Cards**:
   - Vốn ban đầu (Initial Capital)
   - Số dư tài khoản (Account Balance)
   - Lợi nhuận (Net Profit)
   - Số lệnh (Total Trades)
   - Số lệnh thắng (Winning Trades)
   - Số lệnh thua (Losing Trades)
   - Winrate (%)
   - R:R trung bình (Average Risk-to-Reward ratio)
   - Lợi nhuận trung bình (Average Win Amount)
   - Khoản lỗ trung bình (Average Loss Amount)
   - Kỳ vọng (Expectancy per trade)
   - Hệ số lợi nhuận (Profit Factor)

3. **High-Fidelity Visualizations**:
   - **Equity Line Chart**: Dynamic line chart mapping daily growth curves in the active month with custom glowing neon styling using **Chart.js**.
   - **Trading Calendar**: A customized, dark-themed calendar grid modeled exactly on the platform's layout displaying daily net profits (green/red badges), trade counts, and highlighting the current day (June 9, 2026).

4. **Add Trade Modal**:
   - Clean glassmorphic overlay containing form inputs for adding new trades (Date, Symbol, Direction BUY/SELL, Profit/Loss amount, R:R ratio).
   - Data persists across browser refreshes using `localStorage`.
   - Option to reset back to seed default mock datasets.

---

## Project Structure

```text
lambdacapital/
├── index.html     # Main markup containing widgets, modals and elements
├── style.css      # Styling sheets (Glassmorphic variables, dark design grid layout)
├── app.js         # Operations core (Calculations, chart configurations, calendar renders)
├── package.json   # Package manifest (includes server commands)
└── README.md      # Project documentation
```

---

## How to Run Locally

Since this dashboard utilizes standard web tech, you can run it in two ways:

### Option A: Serve with npm (Recommended)
1. Run the local dev server:
   ```bash
   npm run dev
   ```
2. Open your web browser and navigate to `http://localhost:3000`.

### Option B: Open direct
Simply double click or open **`index.html`** in any modern web browser.
