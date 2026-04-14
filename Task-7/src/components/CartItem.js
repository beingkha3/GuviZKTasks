function CartItem({ item, onIncreaseQuantity, onDecreaseQuantity, onRemoveFromCart }) {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200">
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
          {item.title}
        </h4>
        <p className="text-lg font-bold text-gray-900 mt-1">
          ${item.price.toFixed(2)}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDecreaseQuantity(item.id)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-bold"
            >
              -
            </button>
            <span className="w-8 text-center font-medium text-gray-900">
              {item.quantity}
            </span>
            <button
              onClick={() => onIncreaseQuantity(item.id)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-bold"
            >
              +
            </button>
          </div>
          
          <span className="text-lg font-bold text-gray-900">
            ${itemTotal.toFixed(2)}
          </span>
        </div>
      </div>
      
      <button
        onClick={() => onRemoveFromCart(item.id)}
        className="self-start px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;