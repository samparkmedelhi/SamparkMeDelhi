import React, { useState, useEffect } from 'react';
import { Product, Order, OrderInput } from '../types';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { submitCustomerOrder } from '../lib/orderService';
import { 
  X, 
  Check, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Home, 
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProductId?: string;
  onOrderSuccess: (order: Order, whatsappAdminUrl: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  products,
  initialProductId,
  onOrderSuccess
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || (products[0]?.id || '')
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [sameAsMobile, setSameAsMobile] = useState<boolean>(true);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    }
  }, [initialProductId]);

  useEffect(() => {
    if (sameAsMobile) {
      setWhatsapp(mobile);
    }
  }, [mobile, sameAsMobile]);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];
  const totalPrice = currentProduct ? currentProduct.price * quantity : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage("Please enter your full customer name.");
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    const cleanWhatsapp = sameAsMobile ? cleanMobile : whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length < 10) {
      setErrorMessage("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    if (!address.trim() || address.trim().length < 6) {
      setErrorMessage("Please enter your complete delivery address with flat/house number.");
      return;
    }

    const cleanPincode = pincode.replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    setLoading(true);

    try {
      const orderPayload: OrderInput = {
        customerName: customerName.trim(),
        mobile: cleanMobile,
        whatsapp: cleanWhatsapp,
        address: address.trim(),
        city: city.trim(),
        pincode: cleanPincode,
        productId: currentProduct.id,
        quantity,
        customerNote: customerNote.trim() || undefined
      };

      // Save actual order to Firestore database before showing order success
      const result = await submitCustomerOrder(orderPayload);

      // Success
      onOrderSuccess(result.order, result.whatsappAdminUrl);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save order. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFE600] text-black font-extrabold flex items-center justify-center text-xs">
              S
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-base leading-tight">Order Sampark Tag</h3>
              <p className="text-[11px] text-gray-400">Cash on delivery · No online payment required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 max-h-[85vh] overflow-y-auto space-y-5 text-left">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Product Selector */}
          <div className="p-4 rounded-2xl bg-[#fafafa] border border-gray-200/80 space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
              1. Select Product &amp; Quantity
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.price === 0 ? 'Free' : `₹${p.price}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-gray-300">
                <span className="text-xs text-gray-500 font-medium">Qty:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-black font-bold cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-extrabold text-sm text-black w-5 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(50, quantity + 1))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-black font-bold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Calculation Pill */}
            {currentProduct && (
              <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-200 text-gray-600">
                <span>Total Amount to Pay on Delivery:</span>
                <span className="text-base font-black text-black">
                  {currentProduct.price === 0 ? '₹0 (Free)' : `₹${totalPrice}`}
                </span>
              </div>
            )}
          </div>

          {/* Customer Contact Details */}
          <div className="space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
              2. Your Contact Information
            </label>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number (10 Digits) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-gray-400 font-semibold">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98XXXXXXXX"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    WhatsApp Number *
                  </label>
                  <label className="flex items-center gap-1 text-[11px] text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsMobile}
                      onChange={(e) => setSameAsMobile(e.target.checked)}
                      className="rounded text-black focus:ring-[#FFE600]"
                    />
                    <span>Same as mobile</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-gray-400 font-semibold">+91</span>
                  <input
                    type="tel"
                    required
                    disabled={sameAsMobile}
                    maxLength={10}
                    placeholder="WhatsApp number"
                    value={sameAsMobile ? mobile : whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                    className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE600] ${
                      sameAsMobile ? 'bg-gray-100 text-gray-500' : 'bg-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
              3. Delivery Address (Delhi NCR &amp; Pan-India)
            </label>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                House / Flat / Street Address *
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Flat No 301, Tower B, Lotus Greens, Sector 45"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City / State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pincode (6 Digits) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 110001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Customer Note / Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near metro station, deliver after 5 PM"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-gray-200 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-extrabold text-sm sm:text-base transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <span>Confirm Order ({currentProduct.price === 0 ? 'Free' : `₹${totalPrice}`})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-black" /> Free Delivery
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Cash on Delivery
              </span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
