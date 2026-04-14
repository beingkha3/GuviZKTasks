# Income Expense Calculator (Tailwind + Neo‑Brutal Theme)

Responsive web app to track income and expenses. Built with vanilla HTML/JS and Tailwind (via CDN). The UI uses a custom "neo‑brutal" theme for a premium, tactile look.

## Highlights
- Add income/expense entries (description + amount)
- Edit and delete entries (full CRUD)
- Filters (radio buttons / pill UI): All / Income / Expense
- Live summary: Total Income, Total Expense, Net Balance
- Reset button clears inputs and cancels edit mode
- LocalStorage persistence (data remains after refresh)
- Responsive layout with mobile optimizations

## Files of interest
- `index.html` — main UI (includes Tailwind CDN and links `style.css`)
- `app.js` — application logic (CRUD, filters, rendering, localStorage)
- `style.css` — neo‑brutal theme CSS (panels, cards, buttons, noise texture)

## How to run
1. Open `index.html` in your browser.

Data is stored under localStorage key `iec_entries_v1`.
