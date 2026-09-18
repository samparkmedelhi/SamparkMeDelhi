import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { Product } from '../types';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  MessageCircle, 
  ArrowRight,
  AlertCircle,
  Loader2,
  PackageCheck
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { submitCustomerOrder } from '../lib/orderService';

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  pincode: string;
  totalAmount: number;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  whatsappAdminUrl: string;
}

export const CartCheckoutPage: React.FC<{ initialProducts: Product[] }> = ({ initialProducts }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount, addToCart } = useCart();
  const { navigate } = useRouter();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Delhi');
  const [pincode, setPincode] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmationData | null>(null);

  // If cart is empty, add flagship tag if user clicked direct quick buy
  const handleAddDefaultFlagship = () => {
    const flagship = initialProducts.find(p => p.id === 'car-bike-tag') || initialProducts[0];
    if (flagship) {
      addToCart(flagship, 1);
    }
  };

  const handleMobileChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setMobile(digits);
    if (sameAsMobile) {
      setWhatsapp(digits);
    }
  };

  const handlePincodeChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 6);
    setPincode(digits);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add at least one product.');
      return;
    }

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (mobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    const finalWhatsapp = sameAsMobile ? mobile : whatsapp.replace(/\D/g, '').slice(0, 10);
    if (finalWhatsapp.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    if (!address.trim() || address.trim().length < 6) {
      setErrorMessage('Please enter complete delivery address (house/flat, street, locality).');
      return;
    }

    if (pincode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        mobile: mobile.trim(),
        whatsapp: finalWhatsapp,
        address: address.trim(),
        city: city.trim() || 'Delhi',
        pincode: pincode.trim(),
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        productId: cart[0].product.id,
        quantity: cart.reduce((acc, i) => acc + i.quantity, 0),
        customerNote: customerNote.trim() || undefined
      };

      // Save actual order to Firestore database before showing order success
      const result = await submitCustomerOrder(orderPayload);

      // Order created and persisted successfully in Firestore
      const confirmed: OrderConfirmationData = {
        orderId: result.order.id,
        customerName: result.order.customerName,
        mobile: result.order.mobile,
        whatsapp: result.order.whatsapp,
        address: result.order.address,
        city: result.order.city,
        pincode: result.order.pincode,
        totalAmount: result.order.totalAmount,
        items: result.order.items || orderPayload.items,
        whatsappAdminUrl: result.whatsappAdminUrl
      };

      setOrderConfirmation(confirmed);
      clearCart();
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        try {
          window.scrollTo(0, 0);
        } catch {
          // ignore
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderConfirmation) {
    return (
      <div className="py-12 sm:py-16 bg-[#fafafa] min-h-[80vh]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 shadow-sm text-left">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Order Successfully Placed
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mt-1">
                  Thank You, {orderConfirmation.customerName}!
                </h1>
              </div>
            </div>

            {/* Order Reference Badge */}
            <div className="p-4 rounded-2xl bg-[#fafafa] border border-gray-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-gray-500 font-medium block">Order Reference ID:</span>
                <span className="font-mono text-lg font-extrabold text-black tracking-wide">
                  {orderConfirmation.orderId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 font-medium block">Payment Method:</span>
                <span className="text-sm font-bold text-emerald-700">
                  Cash on Delivery (₹{orderConfirmation.totalAmount})
                </span>
              </div>
            </div>

            {/* Products Breakdown */}
            <div className="mb-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Ordered Items
              </h3>
              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden">
                {orderConfirmation.items.map((item, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold text-black">{item.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} · ₹{item.price} each</p>
                    </div>
                    <span className="font-extrabold text-black">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1">
              <p className="font-bold text-black">Delivery Details:</p>
              <p>{orderConfirmation.customerName} ({orderConfirmation.mobile})</p>
              <p>{orderConfirmation.address}, {orderConfirmation.city} - {orderConfirmation.pincode}</p>
              <p className="text-emerald-700 font-semibold pt-1">
                ✓ Dispatched from Narela, Delhi Hub · Expected in 2–4 business days
              </p>
            </div>

            {/* WhatsApp Direct Notification CTA */}
            <div className="space-y-3">
              <a
                href={orderConfirmation.whatsappAdminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-extrabold text-sm sm:text-base transition-all shadow-sm flex items-center justify-center gap-2.5"
              >
                <MessageCircle className="w-5 h-5 text-black" />
                <span>Confirm on Official WhatsApp (+91 84477 77266)</span>
              </a>

              <button
                onClick={() => navigate('/products')}
                className="w-full py-3 text-center text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                ← Back to Products &amp; Store
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART VIEW
  if (cart.length === 0) {
    return (
      <div className="py-16 sm:py-24 bg-[#fafafa] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center mx-auto text-gray-400">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-black tracking-tight">Your Cart is Empty</h2>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              Protect your car, bike, and privacy with our smart QR contact tags.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleAddDefaultFlagship}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-bold text-sm shadow-xs transition-all cursor-pointer"
            >
              Add Flagship Car Tag · ₹499
            </button>
            <button
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold text-sm transition-all cursor-pointer"
            >
              Browse All Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE CART & CHECKOUT FORM
  return (
    <div className="py-10 sm:py-16 bg-[#fafafa] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-left mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
            SECURE CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
            Order Your Sampark Tag
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Zero advance payment. 100% Cash on Delivery across Delhi &amp; Pan-India.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items & Delivery Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Cart Items Card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-7 shadow-xs text-left">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-extrabold text-black flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-black" />
                  <span>Items in Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-4 flex items-start gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-gray-100 border border-gray-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-black truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {item.product.shortDescription}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-black text-gray-500 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-black min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:text-black text-gray-500 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price & Delete */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm sm:text-base font-extrabold text-black">
                            {item.product.price === 0 ? 'Free' : `₹${item.product.price * item.quantity}`}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Details & Delivery Form */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-7 shadow-xs text-left">
              <h2 className="text-base sm:text-lg font-extrabold text-black mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-black" />
                <span>Delivery Address (Cash on Delivery)</span>
              </h2>

              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                
                {/* Customer Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black text-sm text-black"
                  />
                </div>

                {/* Mobile & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      10-Digit Mobile <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs text-gray-400 font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={mobile}
                        onChange={(e) => handleMobileChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black text-sm text-black font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs text-gray-400 font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        disabled={sameAsMobile}
                        value={sameAsMobile ? mobile : whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black text-sm font-medium ${sameAsMobile ? 'bg-gray-50 text-gray-600' : 'text-black'}`}
                      />
                    </div>
                    <label className="mt-1.5 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsMobile}
                        onChange={(e) => setSameAsMobile(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-0"
                      />
                      <span className="text-[11px] text-gray-500 font-medium">
                        Same as mobile number
                      </span>
                    </label>
                  </div>
                </div>

                {/* Complete Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Complete Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House/Flat No., Apartment/Building, Street, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black text-sm text-black resize-none"
                  />
                </div>

                {/* City & Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      City / Region <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Delhi / New Delhi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black text-sm text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      6-Digit PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="110040"
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black text-sm text-black font-medium"
                    />
                  </div>
                </div>

                {/* Optional Customer Note */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please deliver after 2 PM, or call before arrival"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black text-xs sm:text-sm text-black"
                  />
                </div>

                {/* Mobile Checkout Action inside Form */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-full bg-[#FFE600] hover:bg-[#F5D800] disabled:bg-gray-200 text-black font-extrabold text-base transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Placing Your Order...</span>
                      </>
                    ) : (
                      <>
                        <PackageCheck className="w-5 h-5" />
                        <span>Place Order (Cash on Delivery · ₹{totalAmount})</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

          </div>

          {/* Right Column: Order Summary & Trust Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Price Summary Card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-7 shadow-xs text-left space-y-4">
              <h2 className="text-base sm:text-lg font-extrabold text-black pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span className="font-bold text-black">₹{totalAmount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pan-India Delivery</span>
                  </span>
                  <span className="font-bold text-emerald-700 uppercase text-xs">FREE</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cash on Delivery Handling</span>
                  </span>
                  <span className="font-bold text-emerald-700 uppercase text-xs">FREE</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-bold block uppercase tracking-wider">
                    Total Payable Amount
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">
                    Pay upon physical delivery
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-black">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Delhi Dispatch & Trust Card */}
            <div className="bg-[#fafafa] rounded-3xl border border-gray-200/80 p-5 sm:p-6 text-left space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Sampark Delhi Guarantee
              </h3>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-black block">Zero Prepayment Required</span>
                    <span>No advance UPI, credit card, or deposit needed. Pay strictly cash when you receive the package.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-black block">Narela, Delhi Dispatch</span>
                    <span>Dispatched directly from our official hub: Sukar bazar road, near smriti van park, Narela, Delhi - 110040.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-black block">Lifetime Free Cloud Forwarding</span>
                    <span>Includes free masked calling, SMS, and WhatsApp alerts for your car or home tag.</span>
                  </div>
                </div>
              </div>

              {/* Direct Help */}
              <div className="pt-3 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
                <span>Need ordering assistance?</span>
                <a
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsappRaw}?text=Hello%2C%20I%20need%20help%20placing%20an%20order%20for%20Sampark%20Tag.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-black hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  <span>Chat with Support</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
