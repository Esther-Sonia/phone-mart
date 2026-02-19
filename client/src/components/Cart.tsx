import React, { useState } from 'react';
import { CartItem as CartItemType } from '../types';
import CartItem from './CartItem';

interface CartProps {
  items: CartItemType[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

type CheckoutStep = 'cart' | 'mpesa' | 'processing' | 'success';

function Cart(props: CartProps) {
  const { items, isOpen } = props;

  const [step, setStep] = useState<CheckoutStep>('cart');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [mpesaError, setMpesaError] = useState('');

  const total = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const validateMpesa = (number: string) => {
    // Kenyan phone number: 07XXXXXXXX, 01XXXXXXXX, or +2547XXXXXXXX
    const cleaned = number.replace(/\s+/g, '');
    return /^(?:\+?254|0)(7|1)\d{8}$/.test(cleaned);
  };

  const formatMpesaNumber = (value: string) => {
    // Auto-format as user types
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('254')) {
      return '+' + digits.slice(0, 12);
    }
    return digits.slice(0, 10);
  };

  const handleMpesaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMpesaNumber(e.target.value);
    setMpesaNumber(formatted);
    if (mpesaError) setMpesaError('');
  };

  const handleCheckoutClick = () => {
    setStep('mpesa');
  };

  const handleMpesaSubmit = async () => {
    if (!validateMpesa(mpesaNumber)) {
      setMpesaError('Please enter a valid Kenyan phone number (e.g. 0712 345 678)');
      return;
    }

    setStep('processing');

    try {
      const response = await fetch('http://localhost:8000/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: mpesaNumber,
          amount: Math.max(1, Math.round(total)), // ensures amount is never 0
        }),
      });

      const data = await response.json();
      console.log('STK Push response:', data);

      if (data.ResponseCode === '0') {
        setStep('success');
      } else {
        setMpesaError(data.ResponseDescription || 'Payment failed. Try again.');
        setStep('mpesa');
      }
    } catch (err) {
      console.error('STK push error:', err);
      setMpesaError('Could not connect to payment server. Try again.');
      setStep('mpesa');
    }
  };

  const handleClose = () => {
    props.onClose();
    // Reset state after close animation
    setTimeout(() => {
      setStep('cart');
      setMpesaNumber('');
      setMpesaError('');
    }, 300);
  };

  const handleBackToCart = () => {
    setStep('cart');
    setMpesaError('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={handleClose}
    >
      <div
        className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── CART VIEW ── */}
        {(step === 'cart') && (
          <>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
              <button className="text-3xl text-gray-500 hover:text-gray-700" onClick={handleClose}>✕</button>
            </div>

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
                  <span className="text-2xl font-bold text-green-600">KSh {total.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-200"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* ── M-PESA INPUT VIEW ── */}
        {step === 'mpesa' && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <button onClick={handleBackToCart} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-medium">
                ← Back
              </button>
              <h2 className="text-xl font-bold text-gray-800">M-Pesa Payment</h2>
              <button className="text-2xl text-gray-500 hover:text-gray-700" onClick={handleClose}>✕</button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 py-6 gap-6">
              {/* M-Pesa branding strip */}
              <div className="flex items-center justify-center gap-3 bg-green-50 border border-green-200 rounded-xl py-4 px-6">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-black text-xs leading-none">M</span>
                </div>
                <div>
                  <p className="text-green-800 font-bold text-lg leading-none">M-PESA</p>
                  <p className="text-green-600 text-xs mt-0.5">Lipa Na M-Pesa</p>
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800">
                  <span>Amount to Pay</span>
                  <span className="text-green-600 text-lg">KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Phone input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  M-Pesa Phone Number
                </label>
                <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-colors ${mpesaError ? 'border-red-400' : 'border-gray-200 focus-within:border-green-400'}`}>
                  <div className="bg-gray-100 px-3 py-4 border-r border-gray-200">
                    <span className="text-gray-500 text-sm font-medium">🇰🇪</span>
                  </div>
                  <input
                    type="tel"
                    value={mpesaNumber}
                    onChange={handleMpesaChange}
                    placeholder="0712 345 678"
                    className="flex-1 px-4 py-4 text-gray-800 text-lg font-medium outline-none bg-white placeholder-gray-300"
                    autoFocus
                  />
                </div>
                {mpesaError && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span>⚠</span> {mpesaError}
                  </p>
                )}
                <p className="text-gray-400 text-xs">
                  You'll receive an STK push prompt on this number to confirm payment.
                </p>
              </div>

              <button
                onClick={handleMpesaSubmit}
                className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-4 rounded-xl transition-all duration-200 text-lg shadow-md shadow-green-200"
              >
                Send STK Push →
              </button>
            </div>
          </div>
        )}

        {/* ── PROCESSING VIEW ── */}
        {step === 'processing' && (
          <div className="flex flex-col h-full items-center justify-center px-8 gap-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Check Your Phone</h3>
              <p className="text-gray-500 leading-relaxed">
                An M-Pesa prompt has been sent to
              </p>
              <p className="text-green-600 font-bold text-lg mt-1">{mpesaNumber}</p>
              <p className="text-gray-500 mt-2">Enter your M-Pesa PIN to complete the payment.</p>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg className="animate-spin h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Waiting for confirmation…
            </div>
          </div>
        )}

        {/* ── SUCCESS VIEW ── */}
        {step === 'success' && (
          <div className="flex flex-col h-full items-center justify-center px-8 gap-6 text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-500">
                KSh {total.toLocaleString()} paid via M-Pesa from
              </p>
              <p className="text-green-600 font-bold text-lg mt-1">{mpesaNumber}</p>
            </div>
            <p className="text-gray-400 text-sm">An SMS receipt has been sent to your phone.</p>
            <button
              onClick={handleClose}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition duration-200"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;