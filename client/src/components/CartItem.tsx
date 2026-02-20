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
  const atMaxStock = item.quantity >= item.product.stock;

  function handleIncrease() {
    if (!atMaxStock) props.onUpdateQuantity(item.product.id, item.quantity + 1);
  }

  function handleDecrease() {
    if (item.quantity > 1) props.onUpdateQuantity(item.product.id, item.quantity - 1);
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-sky-900/30 hover:border-sky-500/30 transition-all duration-200 group">

      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-xl border border-sky-900/30"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-slate-900/30 to-transparent" />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-sky-400 font-medium uppercase tracking-wider mb-0.5">
          {item.product.brand}
        </p>
        <h4 className="font-semibold text-white text-sm truncate">
          {item.product.name}
        </h4>
        <p className="text-slate-400 text-xs mt-1">
          KSh {item.product.price.toLocaleString()} each
        </p>
        {atMaxStock && (
          <p className="text-amber-400 text-xs mt-1">⚠ Max stock reached</p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-1 bg-slate-900/60 border border-sky-900/40 rounded-xl p-1">
        <button
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-sky-500/20 hover:text-sky-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 font-bold text-lg leading-none"
        >
          −
        </button>
        <span className="w-7 text-center text-white font-bold text-sm">
          {item.quantity}
        </span>
        <button
          onClick={handleIncrease}
          disabled={atMaxStock}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-sky-500/20 hover:text-sky-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 font-bold text-lg leading-none"
        >
          +
        </button>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="font-bold text-sky-300 text-sm mb-2">
          KSh {subtotal.toLocaleString()}
        </p>
        <button
          onClick={() => props.onRemove(item.product.id)}
          className="flex items-center gap-1 text-slate-500 hover:text-red-400 text-xs transition-colors duration-200 ml-auto"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>

    </div>
  );
}

export default CartItem;