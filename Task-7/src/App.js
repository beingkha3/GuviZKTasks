import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';

function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('guvi-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('guvi-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const isInCart = cart.some((item) => item.id === product.id);
    if (isInCart) return;
    setCart((prev) => [...prev, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const isInCart = (productId) => cart.some((item) => item.id === productId);

  const getCartItemCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar cartCount={getCartItemCount()} />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <ProductsPage
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  isInCart={isInCart}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  removeFromCart={removeFromCart}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;