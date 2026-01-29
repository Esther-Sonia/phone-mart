import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ProductCard(props: ProductCardProps) {
  const { product } = props;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <p className="text-gray-500 text-sm uppercase tracking-wide mb-1">
          {product.brand}
        </p>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {product.name}
        </h3>
        
        <div className="text-sm text-gray-600 mb-4 space-y-1">
          <p>📱 {product.specs.screen}</p>
          <p>💾 {product.specs.storage}</p>
          <p>🧠 {product.specs.ram}</p>
          <p>📷 {product.specs.camera}</p>
        </div>

        <div className="flex justify-between items-center mb-2">
          <p className="text-2xl font-bold text-green-600">
            KSh {product.price.toLocaleString()}
          </p>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => props.onAddToCart(product)}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>

        <p className="text-xs text-gray-500">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;