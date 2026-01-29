import React from 'react';
import { CartItem as CartItemType } from '../types';
import CartItem from './CartItem';

interface CartProps {
  items: CartItemType[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

function Cart(props: CartProps) {
  const { items, isOpen } = props;

  const total = items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={props.onClose}
    >
      <div 
        className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
          <button 
            className="text-3xl text-gray-500 hover:text-gray-700"
            onClick={props.onClose}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-400">Your cart is empty</p>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={props.onUpdateQuantity}
                  onRemove={props.onRemove}
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                KSh {total.toLocaleString()}
              </span>
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-200">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;