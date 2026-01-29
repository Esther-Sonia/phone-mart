import React from 'react';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

function CartItem(props: CartItemProps) {
  const { item } = props;
  const subtotal = item.product.price * item.quantity;

  function handleIncrease() {
    if (item.quantity < item.product.stock) {
      props.onUpdateQuantity(item.product.id, item.quantity + 1);
    }
  }

  function handleDecrease() {
    if (item.quantity > 1) {
      props.onUpdateQuantity(item.product.id, item.quantity - 1);
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <img 
        src={item.product.image} 
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">
          {item.product.brand} {item.product.name}
        </h4>
        <p className="text-sm text-gray-500">
          KSh {item.product.price.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button 
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
          onClick={handleDecrease}
        >
          -
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button 
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleIncrease}
          disabled={item.quantity >= item.product.stock}
        >
          +
        </button>
      </div>
      <div className="text-right min-w-[120px]">
        <p className="font-bold text-green-600 mb-2">
          KSh {subtotal.toLocaleString()}
        </p>
        <button 
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition duration-200"
          onClick={() => props.onRemove(item.product.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;