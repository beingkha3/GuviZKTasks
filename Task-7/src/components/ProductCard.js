function ProductCard({ product, addToCart, removeFromCart, isInCart }) {
  const inCart = isInCart(product.id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>
        
        <h3 className="text-gray-900 font-medium text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>
        
        <p className="text-xl font-bold text-gray-900 mb-4">
          ${product.price.toFixed(2)}
        </p>
        
        {inCart ? (
          <button
            onClick={() => removeFromCart(product.id)}
            className="w-full py-2.5 px-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors duration-200"
          >
            Remove from Cart
          </button>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2.5 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;