import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import PriceSummary from '../components/PriceSummary';

function CartPage({ cart, increaseQuantity, decreaseQuantity, removeFromCart }) {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2c0 1.1.9 2 2 2" />
        </svg>
        <p className="text-gray-500 font-medium mb-2">Your cart is empty</p>
        <p className="text-gray-400 text-sm mb-6">Add some products to get started!</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.1;
  const total = subtotal - discount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncreaseQuantity={increaseQuantity}
              onDecreaseQuantity={decreaseQuantity}
              onRemoveFromCart={removeFromCart}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <PriceSummary subtotal={subtotal} discount={discount} total={total} itemCount={cart.length} />
        </div>
      </div>
    </div>
  );
}

export default CartPage;