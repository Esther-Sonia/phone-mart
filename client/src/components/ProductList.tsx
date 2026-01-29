import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts } from '../services/api';
import ProductCard from './ProductCard';

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

function ProductList(props: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Phones</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            onAddToCart={props.onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;