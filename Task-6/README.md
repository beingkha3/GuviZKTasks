# ShopStore - Shopping Cart App

A modern, responsive React shopping cart application that fetches products from the Fake Store API.

## Features

- Product grid display with images, titles, and prices
- Add to cart functionality with duplicate item detection
- Cart modal with item list and remove functionality
- Real-time cart count in navbar
- Loading and error states for API
- Empty cart state
- Responsive design for mobile and desktop

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Fake Store API

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Top navigation with cart button
│   ├── ProductList.jsx   # Product grid with API fetch
│   ├── ProductCard.jsx  # Individual product card
│   └── CartModal.jsx     # Shopping cart modal
├── App.jsx               # Main app with state management
├── main.jsx              # React entry point
└── index.css             # Global styles with Tailwind
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Usage

- Browse products on the main page
- Click "Add to Cart" to add a product
- If product is already in cart, an alert appears
- Click the Cart button in navbar to open cart modal
- Remove items from cart using the Remove button
- Cart count updates instantly in navbar

## API

Products are fetched from: https://fakestoreapi.com/products
