import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Show notification for 3 seconds
  function showNotification(message: string) {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  }

  // Add product to cart
  function handleAddToCart(product: Product) {
    const existingItem = cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // Product already in cart, increase quantity
      if (existingItem.quantity < product.stock) {
        setCartItems(cartItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        showNotification(`Added another ${product.name} to cart! 🎉`);
      } else {
        showNotification('⚠️ Cannot add more. Stock limit reached.');
        return;
      }
    } else {
      // Add new product to cart
      setCartItems([...cartItems, { product, quantity: 1 }]);
      showNotification(`${product.name} added to cart! 🛒`);
    }
    
    // Open cart to show the item was added
    setIsCartOpen(true);
  }

  // Update quantity of item in cart
  function handleUpdateQuantity(productId: string, quantity: number) {
    setCartItems(cartItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  }

  // Remove item from cart
  function handleRemoveFromCart(productId: string) {
    const removedItem = cartItems.find(item => item.product.id === productId);
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    if (removedItem) {
      showNotification(`${removedItem.product.name} removed from cart 🗑️`);
    }
  }

  // Calculate total number of items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <Navbar 
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in">
          <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-2xl p-4 max-w-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{notification}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-extrabold mb-4 animate-fade-in">
              Welcome to PhoneMart! 📱
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              Discover the latest smartphones at unbeatable prices
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Warranty Included</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Summary Bar (Fixed at bottom on mobile) */}
      {cartCount > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl z-40">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{cartCount} item{cartCount > 1 ? 's' : ''}</p>
              <p className="text-lg font-bold text-green-600">KSh {totalPrice.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
            >
              View Cart
            </button>
          </div>
        </div>
      )}
      
      <ProductList onAddToCart={handleAddToCart} />
      
      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-black-400">© 2026 PhoneMart. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <a href="#privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white transition">Terms of Service</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;