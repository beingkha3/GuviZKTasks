import { useState } from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CartModal from './components/CartModal';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    const isInCart = cart.some((item) => item.id === product.id);
    
    if (isInCart) {
      alert('Item already added to the cart');
      return;
    }
    
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} onOpenCart={openCart} />
      
      <main>
        <ProductList onAddToCart={addToCart} />
      </main>

      <CartModal
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cart}
        onRemoveFromCart={removeFromCart}
      />
    </div>
  );
}

export default App;
