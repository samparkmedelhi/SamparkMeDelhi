import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import {
  X,
  Star,
  Phone,
  MessageSquare,
  Lock,
  AlertTriangle,
  FileText,
  Droplets,
  Check,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  QrCode,
  Smartphone
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderNow: (product: Product) => void;
}

type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  label: string;
}

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', rate: 1, label: '₹ INR' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, label: '$ USD' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, label: '€ EUR' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0095, label: '£ GBP' },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044, label: 'د.إ AED' },
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderNow
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('INR');
  const [isAdded, setIsAdded] = useState(false);

  // Reset image index and added state on product change
  useEffect(() => {
    setSelectedImageIndex(0);
    setIsAdded(false);
  }, [product?.id]);

  if (!isOpen || !product) return null;

  // Determine dynamic gallery based on product - do not invent unrelated photos
  const getProductGallery = (): string[] => {
    if (product.gallery && product.gallery.length > 0) {
      return product.gallery;
    }
    if (product.image) {
      return [product.image];
    }
    return ['https://i.ibb.co/7dKMmXRw/image.png'];
  };

  const galleryImages = getProductGallery();
  const activeImage = galleryImages[selectedImageIndex] || galleryImages[0];

  // Price conversion
  const formatPrice = (amountInInr: number) => {
    const cur = CURRENCIES[selectedCurrency];
    if (cur.code === 'INR') {
      return `₹${amountInInr}`;
    }
    const converted = Math.round(amountInInr * cur.rate * 100) / 100;
    return `${cur.symbol}${converted.toFixed(2)}`;
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF9F6] rounded-2xl sm:rounded-3xl max-w-5xl w-full my-4 sm:my-8 overflow-hidden shadow-2xl border border-neutral-200 text-left transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Breadcrumb Navigation matching screenshot */}
        <div className="px-5 sm:px-8 pt-6 pb-2 text-xs sm:text-sm text-neutral-500 font-medium flex items-center flex-wrap gap-1.5">
          <button
            onClick={onClose}
            className="text-[#D4A017] hover:text-[#B3830C] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
          >
            Shop
          </button>
          <span>/</span>
          <span className="text-neutral-700 truncate max-w-[280px] sm:max-w-md md:max-w-xl">
            {product.name}
          </span>
        </div>

        {/* Main Product Section: Two Column Layout */}
        <div className="p-5 sm:p-8 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Large Product Image Gallery */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Main Image Container */}
            <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-neutral-200/80 shadow-xs flex items-center justify-center p-3 sm:p-4">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain object-center transition-all duration-300"
              />
            </div>

            {/* Thumbnail Navigation */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 sm:gap-3 mt-4 w-full overflow-x-auto pb-1 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white border-2 transition-all shrink-0 cursor-pointer shadow-2xs ${
                      selectedImageIndex === idx
                        ? 'border-neutral-900 ring-2 ring-neutral-900/20 scale-105'
                        : 'border-neutral-200/90 opacity-70 hover:opacity-100 hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain object-center p-1"
                    />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Product Info & Actions matching Reference */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Product Badge Pill */}
              <div className="inline-flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-[#FFE600] text-[#FFE600]" />
                <span>{product.badge || 'Best seller on Amazon'}</span>
              </div>

              {/* Large Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-2.5">
                {product.name}
              </h1>

              {/* Rating Stars (★★★★★ 4.4) */}
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-black text-base tracking-tighter select-none font-black">
                  ★★★★★
                </span>
                <span className="text-sm font-bold text-neutral-800">4.4</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.shortDescription ||
                  'We park our vehicles every day in public places, BUT have we ever thought if the parked vehicle is creating any issues, and if it does how come someone can reach us? Many of us leave our contact...'}
              </p>

              {/* 6 Key Benefits Card Grid (Exact visual match to screenshot) */}
              <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-semibold text-neutral-800">
                  
                  {/* Item 1: Masked audio & video calls */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5 text-pink-600" />
                    </div>
                    <span className="leading-snug">Masked audio &amp; video calls</span>
                  </div>

                  {/* Item 2: WhatsApp & SMS alerts */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <span className="leading-snug">WhatsApp &amp; SMS alerts</span>
                  </div>

                  {/* Item 3: Your number stays private */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <span className="leading-snug">Your number stays private</span>
                  </div>

                  {/* Item 4: Emergency contact */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-black text-rose-600 tracking-tighter">SOS</span>
                    </div>
                    <span className="leading-snug">Emergency contact</span>
                  </div>

                  {/* Item 5: Vehicle docs behind OTP */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <span className="leading-snug">Vehicle docs behind OTP</span>
                  </div>

                  {/* Item 6: Waterproof · lifetime free */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <span className="leading-snug">Waterproof · lifetime free</span>
                  </div>

                </div>
              </div>

              {/* Price Display */}
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Currency Selector matching screenshot */}
              <div className="mt-4">
                <label
                  htmlFor="modal-currency"
                  className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5"
                >
                  CURRENCY
                </label>
                <div className="relative max-w-xs">
                  <select
                    id="modal-currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                    className="w-full appearance-none bg-white border border-neutral-300 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-neutral-800 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FFE600] cursor-pointer shadow-2xs"
                  >
                    {Object.values(CURRENCIES).map((cur) => (
                      <option key={cur.code} value={cur.code}>
                        {cur.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Primary Actions: Add to cart & Quick Order */}
              <div className="mt-6 space-y-2.5">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 px-8 rounded-full bg-[#FFE600] hover:bg-[#F5D800] active:scale-[0.99] text-black font-extrabold text-base sm:text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 text-black stroke-[3]" />
                      <span>Added to cart</span>
                    </>
                  ) : (
                    <span>Add to cart</span>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-neutral-500 font-medium px-2 pt-1">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Free pan-India delivery</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Cash on delivery available</span>
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Section: "What You'll Get" matching Step 6 requirements */}
        <div className="px-5 sm:px-8 py-8 border-t border-neutral-200/80 bg-white">
          <div className="max-w-4xl">
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight mb-2">
              What You&apos;ll Get
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mb-6">
              Complete boxed kit with lifetime cloud services. No monthly recharge, zero subscriptions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              
              {/* Card 1: The Physical Tag */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-neutral-200/80 flex flex-col justify-between text-left">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#FFE600]/40 flex items-center justify-center text-black mb-3">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">
                    Physical Sampark Smart Tag
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {product.name.toLowerCase().includes('pack of 2')
                      ? '2x weatherproof tags with high-strength automotive grade adhesive designed for sun, car wash, and extreme heat.'
                      : product.name.toLowerCase().includes('bike')
                      ? '2x specialized curved tags (1 for bike body + 1 for rider helmet) with UV-proof scratch protection.'
                      : '1x durable automotive windshield tag with high-contrast optical QR code and NFC tap compatibility.'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-200/60 text-[11px] font-semibold text-neutral-500">
                  ✓ High durability UV &amp; waterproof
                </div>
              </div>

              {/* Card 2: Masked Calling & Contact */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-neutral-200/80 flex flex-col justify-between text-left">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-3">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">
                    Masked Call &amp; WhatsApp Alerts
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Callers never see your private digits. Anyone scanning connects instantly via private routed call or pre-set WhatsApp quick messages without installing an app.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-200/60 text-[11px] font-semibold text-neutral-500">
                  ✓ 100% Privacy Protected
                </div>
              </div>

              {/* Card 3: Emergency SOS & Document Locker */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-neutral-200/80 flex flex-col justify-between text-left">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 mb-3">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">
                    Emergency SOS &amp; OTP Vault
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Configure emergency blood group, emergency family phone contacts, and lock digital RC / insurance copies behind a secure one-time passcode.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-200/60 text-[11px] font-semibold text-neutral-500">
                  ✓ Lifetime Free Cloud Platform
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Section: Features & Specs */}
        <div className="px-5 sm:px-8 py-6 bg-[#FAF9F6] border-t border-neutral-200/70 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-neutral-700">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-neutral-900" />
            <span>Free Express Delivery Across India</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-neutral-900" />
            <span>60-Day Replacement Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-900" />
            <span>1-Year Hardware Warranty</span>
          </div>
        </div>

      </div>
    </div>
  );
};
