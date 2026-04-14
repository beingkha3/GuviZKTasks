function PriceSummary({ subtotal, discount, total, itemCount }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-green-600">
          <span>Discount (10%)</span>
          <span className="font-medium">-${discount.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceSummary;