import React from 'react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

function Navbar(props: NavbarProps) {
  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <span className="text-3xl">📱</span>
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight">
                PhoneMart
              </h1>
              <p className="text-gray-400 text-xs">Your Tech Paradise</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-red transition duration-200 font-medium">
              Home
            </a>
            <a href="#products" className="text-gray-300 hover:text-white transition duration-200 font-medium">
              Products
            </a>
            <a href="#deals" className="text-gray-300 hover:text-white transition duration-200 font-medium">
              Deals
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition duration-200 font-medium">
              Contact
            </a>
          </div>

          {/* Cart Button */}
          <button 
            className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            onClick={props.onCartClick}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <span>Cart</span>
            {props.cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                {props.cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;