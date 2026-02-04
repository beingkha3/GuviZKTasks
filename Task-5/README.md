# Income Expense Calculator (Tailwind)

A simple responsive web app to track income and expenses. Uses Tailwind via CDN and vanilla JavaScript. Supports full CRUD, filters, totals, reset, and localStorage persistence.

## Features
- Add income/expense entries (description + amount)
- Edit and delete entries (CRUD)
- Filters (radio buttons): All / Income / Expense
- Summary at top: Total Income, Total Expense, Net Balance
- Reset button clears the form and cancels edit mode
- LocalStorage persistence (data remains after refresh)
- Responsive design (mobile + desktop)

## How to run
1. Open `index.html` in the browser.
2. Optional: Use VS Code Live Server for a better dev experience.

Data is stored under localStorage key `iec_entries_v1`.
