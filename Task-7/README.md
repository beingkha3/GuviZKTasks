# Guvi Cart App

A ReactJS shopping cart application that fetches products from the Fake Store API with full cart functionality, quantity management, and pricing calculations.

## Features

- Product listing from Fake Store API
- Add/Remove products from cart
- Quantity management (increase/decrease)
- Cart total calculations with 10% discount
- Persistent cart (saved to localStorage)
- Responsive design
- Loading and error states

## Tech Stack

- ReactJS (JavaScript)
- React Router v6
- Tailwind CSS
- Fake Store API

## Project Structure

```
Task-7/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CartItem.js
│   │   ├── Navbar.js
│   │   ├── PriceSummary.js
│   │   └── ProductCard.js
│   ├── pages/
│   │   ├── CartPage.js
│   │   └── ProductsPage.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Navigate to the project directory:
   ```bash
   cd Task-7
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

## Routing

- `/` - Products page (home)
- `/cart` - Cart page

## Cart Logic

- **Add to Cart**: Adds product with quantity 1 (duplicates prevented)
- **Remove from Cart**: Removes entire product from cart
- **Increase Quantity**: Increments quantity by 1
- **Decrease Quantity**: Decrements by 1, removes item at quantity 0
- **Item Total**: Price × Quantity
- **Subtotal**: Sum of all item totals
- **Discount**: 10% of subtotal
- **Final Total**: Subtotal - Discount
