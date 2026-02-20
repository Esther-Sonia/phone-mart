import React from 'react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

function Navbar(props: NavbarProps) {
  return (
    <nav style={{ background: 'linear-gradient(135deg, #071426 0%, #0a1f3c 50%, #071426 100%)' }}
      className="shadow-2xl sticky top-0 z-50 border-b border-sky-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-sky-400/20 border border-sky-400/30 p-2 rounded-xl">
              <span className="text-3xl">📱</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-sky-300 via-blue-200 to-sky-400 bg-clip-text text-transparent">
                PhoneMart
              </h1>
              <p className="text-sky-500/60 text-xs">Your Tech Paradise</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Products', 'Deals', 'Contact'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-slate-400 hover:text-sky-300 transition-colors duration-200 font-medium text-sm relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-sky-400 group-hover:w-full transition-all duration-200" />
              </a>
            ))}
          </div>

          {/* Cart Button */}
          <button
            className="relative bg-sky-400 hover:bg-sky-300 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-400/30 flex items-center space-x-2"
            onClick={props.onCartClick}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
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

          <button className="md:hidden text-sky-400">
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