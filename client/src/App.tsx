import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem } from './types';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';


const HERO_BG_IMAGE = '/phonescreen1.png';

const categories = [
  {
    tag: 'FLAGSHIP PHONES',
    title: 'Up to 20% Off',
    img: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=300&hei=600&fmt=png-alpha',
    bg: 'from-slate-800 to-slate-900',
    accent: '#7dd3fc',
  },
  {
    tag: 'BUDGET PICKS',
    title: 'Up to 15% Off',
    img: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=300&hei=600&fmt=png-alpha',
    bg: 'from-sky-900 to-slate-900',
    accent: '#38bdf8',
  },
  {
    tag: 'ACCESSORIES',
    title: 'Up to 10% Off',
    img: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=300&hei=600&fmt=png-alpha',
    bg: 'from-blue-900 to-slate-900',
    accent: '#bae6fd',
  },
];

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');
  const [scrollY, setScrollY] = useState(0);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function showNotification(message: string) {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  }

  function handleAddToCart(product: Product) {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCartItems(cartItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
        showNotification(`Added another ${product.name} to cart! 🎉`);
      } else {
        showNotification('⚠️ Cannot add more. Stock limit reached.');
        return;
      }
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
      showNotification(`${product.name} added to cart! 🛒`);
    }
    setIsCartOpen(true);
  }

  function handleUpdateQuantity(productId: string, quantity: number) {
    setCartItems(cartItems.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  }

  function handleRemoveFromCart(productId: string) {
    const removedItem = cartItems.find(item => item.product.id === productId);
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    if (removedItem) showNotification(`${removedItem.product.name} removed from cart 🗑️`);
  }

  function scrollToProducts() {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const heroOpacity = Math.max(0, 1 - scrollY / 500);
  const parallax = scrollY * 0.25;

  const hasBgImage = HERO_BG_IMAGE.trim() !== '';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

      {notification && (
        <div className="fixed top-24 right-4 z-50">
          <div className="bg-white border-l-4 border-sky-400 rounded-lg shadow-2xl p-4 max-w-sm flex items-center gap-3">
            <svg className="h-6 w-6 text-sky-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-gray-900">{notification}</p>
          </div>
        </div>
      )}

      <div
        className="relative overflow-hidden flex items-center"
        style={{
          height: 'calc(100vh - 80px)',
          ...(hasBgImage
            ? {
                backgroundImage: `url('${HERO_BG_IMAGE}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#0c2a4a',
              }
            : {
                background: 'linear-gradient(120deg, #e8f4fd 0%, #dbeafe 45%, #bfdbfe 100%)',
              }),
        }}
      >
        {/* Dark overlay — only shown when a BG image is set so text stays readable */}
        {hasBgImage && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{ background: 'linear-gradient(120deg, rgba(10,22,40,0.82) 0%, rgba(12,42,74,0.65) 55%, rgba(14,58,110,0.45) 100%)' }}
          />
        )}

        {/* Subtle grid — only on gradient mode */}
        {!hasBgImage && (
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(14,116,144,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,116,144,0.05) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        )}

        {/* Left text content */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 w-full flex items-center justify-between gap-8"
          style={{ transform: `translateY(${parallax}px)`, opacity: heroOpacity }}
        >
          <div className="max-w-xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border ${hasBgImage ? 'bg-sky-400/10 border-sky-400/30' : 'bg-sky-500/10 border-sky-400/30'}`}>
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span className={`text-xs font-semibold tracking-widest uppercase ${hasBgImage ? 'text-sky-300' : 'text-sky-700'}`}>
                Kenya's #1 Phone Store
              </span>
            </div>

            <h1 className={`text-6xl lg:text-7xl font-extrabold leading-tight mb-4 ${hasBgImage ? 'text-white' : 'text-slate-900'}`}>
              <span className="text-sky-500">Best Phones</span>
              <br />
              Online Shop
              <br />
              <span className={hasBgImage ? 'text-sky-100' : 'text-slate-700'}>in Kenya</span>
            </h1>

            <p className={`text-lg mb-10 leading-relaxed max-w-md ${hasBgImage ? 'text-sky-100/60' : 'text-slate-500'}`}>
              Shop the latest iPhones, Samsung & more. Fast delivery across Kenya with official warranty.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={scrollToProducts}
                className={`font-bold px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl text-base ${hasBgImage ? 'bg-sky-400 hover:bg-sky-300 text-slate-900 hover:shadow-sky-400/30' : 'bg-slate-900 hover:bg-sky-600 text-white hover:shadow-sky-500/20'}`}
              >
                Shop Now
              </button>
              <button
                onClick={scrollToProducts}
                className={`border-2 font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base ${hasBgImage ? 'border-white/20 hover:border-sky-400 text-white/70 hover:text-sky-300' : 'border-slate-300 hover:border-sky-400 text-slate-600 hover:text-sky-600'}`}
              >
                View Deals →
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 mt-12">
              {[
                { num: '500+', label: 'Products' },
                { num: '12K+', label: 'Customers' },
                { num: '4.9★', label: 'Rating' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className={`text-2xl font-extrabold ${hasBgImage ? 'text-white' : 'text-slate-900'}`}>{num}</div>
                  <div className={`text-xs mt-0.5 ${hasBgImage ? 'text-sky-300/50' : 'text-slate-400'}`}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          style={{ opacity: heroOpacity }}
          onClick={scrollToProducts}
        >
          <span className={`text-xs tracking-widest uppercase ${hasBgImage ? 'text-sky-300/60' : 'text-slate-400'}`}>
            Scroll to explore
          </span>
          <div className={`w-6 h-10 border-2 rounded-full flex items-start justify-center p-1.5 ${hasBgImage ? 'border-sky-400/30' : 'border-slate-300'}`}>
            <div className="w-1.5 h-2.5 bg-sky-500 rounded-full animate-bounce" />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            {[0, 1, 2].map(i => (
              <svg key={i} className="w-4 h-4 text-sky-400"
                style={{ opacity: 0.2 + i * 0.3 }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORY DEAL CARDS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.bg} cursor-pointer group`}
              style={{ minHeight: '200px' }}
              onClick={scrollToProducts}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle at 70% 50%, ${cat.accent}22, transparent 70%)` }} />

              <div className="relative z-10 p-7 flex items-center justify-between h-full">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: cat.accent }}>
                    {cat.tag}
                  </p>
                  <h3 className="text-white text-2xl font-extrabold mb-4">{cat.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: cat.accent }}>
                    <span>▶</span>
                    <span className="uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-200">
                      Shop Now
                    </span>
                  </div>
                  <div className="mt-1 h-px w-16 group-hover:w-24 transition-all duration-300" style={{ background: cat.accent }} />
                </div>
                <img
                  src={cat.img}
                  alt={cat.tag}
                  className="h-36 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <div ref={productsRef} id="products" className="scroll-mt-20">
        <ProductList onAddToCart={handleAddToCart} />
      </div>

      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
      />

      {/* Mobile cart bar */}
      {cartCount > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-sky-100 p-4 shadow-2xl z-40">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{cartCount} item{cartCount > 1 ? 's' : ''}</p>
              <p className="text-lg font-bold text-sky-600">KSh {totalPrice.toLocaleString()}</p>
            </div>
            <button onClick={() => setIsCartOpen(true)}
              className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-white mt-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #071426 0%, #0a1f3c 50%, #071426 100%)' }}
      >
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-10" style={{ background: '#7dd3fc' }} />
        <div className="absolute -top-16 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-10" style={{ background: '#38bdf8' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="text-2xl font-extrabold bg-gradient-to-r from-sky-300 via-blue-200 to-sky-400 bg-clip-text text-transparent mb-2">
                📱 PhoneMart
              </div>
              <p className="text-slate-500 text-sm mb-4">Kenya's #1 Phone Store</p>
              <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/30 rounded-full px-3 py-1 w-fit mb-5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs">Open · Mon–Sat 8am–8pm</span>
              </div>
              <div className="flex gap-2">
                {['𝕏', 'in', 'f', '▶'].map((icon, i) => (
                  <a key={i} href="#"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-sky-400/20 hover:border-sky-400/40 hover:text-white hover:-translate-y-1 transition-all duration-200 text-sm">
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-sky-400 uppercase mb-4">Shop</p>
              {['iPhones', 'Samsung', 'Accessories', 'New Arrivals', 'Best Sellers'].map(link => (
                <a key={link} href="#" className="block text-slate-400 hover:text-sky-300 hover:translate-x-1 transition-all duration-200 text-sm mb-2">{link}</a>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-sky-400 uppercase mb-4">Support</p>
              {['Contact Us', 'Track Order', 'Returns & Refunds', 'Warranty Info', 'FAQs'].map(link => (
                <a key={link} href="#" className="block text-slate-400 hover:text-sky-300 hover:translate-x-1 transition-all duration-200 text-sm mb-2">{link}</a>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-sky-400 uppercase mb-4">Contact</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: '📍', text: 'Nairobi, Kenya' },
                  { icon: '📞', text: '+254 700 000 000' },
                  { icon: '✉️', text: 'hello@phonemart.ke' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-slate-400 text-sm">
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-sm">© 2026 PhoneMart. All rights reserved.</p>
            <div className="flex gap-5">
              {['Privacy Policy', 'Terms of Service', 'Cookies'].map(link => (
                <a key={link} href="#" className="text-slate-600 hover:text-sky-300 text-xs transition-colors duration-200">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;