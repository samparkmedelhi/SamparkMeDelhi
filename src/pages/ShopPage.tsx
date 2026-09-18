import React, { useState } from 'react';
import { Product } from '../types';
import { Truck, RotateCcw, ShieldCheck, Banknote, Star, ChevronDown, ArrowRight } from 'lucide-react';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', rate: 1, label: '₹ INR (India)' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, label: '$ USD' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, label: '€ EUR' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0095, label: '£ GBP' },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044, label: 'د.إ AED' },
};

interface ShopPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  hideBottomStrip?: boolean;
  isHomepage?: boolean;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onSelectProduct,
  hideBottomStrip = false,
  isHomepage = false,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('INR');

  const formatPrice = (amountInInr: number) => {
    const cur = CURRENCIES[selectedCurrency];
    if (cur.code === 'INR') {
      return `₹${amountInInr}`;
    }
    const converted = Math.round(amountInInr * cur.rate * 100) / 100;
    return `${cur.symbol}${converted.toFixed(2)}`;
  };

  // Ensure products are displayed in the exact requested order
  const displayProducts = [...products].sort((a, b) => {
    const order = ['car-sampark-tag-pack-2', '2-ngf132-bike-tags', 'car-bike-sampark-tag'];
    const idxA = order.indexOf(a.id);
    const idxB = order.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        
        {/* Header section matching Image 1 */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-neutral-500 mb-2">
            {isHomepage ? 'TAGS KHAREEDO' : 'SHOP'}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            {isHomepage ? 'Apna Sampark tag chuno.' : 'Pick your Sampark tag.'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            {isHomepage
              ? 'Ek baar khareedo, lifetime free services pao. Har order par free delivery aur cash on delivery available.'
              : 'One-time buy, free services for life. Free delivery and cash on delivery on every order.'}
          </p>

          {/* Currency Selector matching screenshot */}
          <div className="mt-6 inline-flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5">
              {isHomepage ? 'CURRENCY CHANGE KAREIN' : 'CHANGE CURRENCY'}
            </span>
            <div className="relative inline-block">
              <select
                id="shop-currency-selector"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                className="appearance-none bg-white border border-neutral-300 rounded-full px-4 py-2 pr-9 text-xs sm:text-sm font-bold text-neutral-800 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FFE600] cursor-pointer shadow-2xs transition-all"
                aria-label="Select currency"
              >
                {Object.values(CURRENCIES).map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {displayProducts.map((product) => {
            const hasOriginalPrice = product.originalPrice && product.originalPrice > product.price;

            return (
              <div
                key={product.id}
                id={`shop-product-${product.id}`}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group"
              >
                {/* Top Badge (e.g. BEST SELLER) */}
                {product.badge && (
                  <div className="absolute top-5 left-5 z-10">
                    <span className="inline-flex items-center gap-1 bg-neutral-900 text-white text-[10px] sm:text-[11px] font-black tracking-wide px-3 py-1 rounded-full uppercase shadow-xs">
                      <Star className="w-3 h-3 fill-[#FFE600] text-[#FFE600]" />
                      <span>{product.badge}</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* Product Thumbnail Container */}
                  <div className="w-full aspect-square rounded-2xl bg-white border border-neutral-100 flex items-center justify-center p-3 sm:p-4 mb-5 overflow-hidden">
                    <img
                      id={`shop-product-img-${product.id}`}
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full max-w-full max-h-full object-contain object-center select-none"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (product.id === 'car-sampark-tag-pack-2' && !target.src.includes('/images/car-sampark-tag-pack-2.png')) {
                          target.src = '/images/car-sampark-tag-pack-2.png';
                        }
                      }}
                    />
                  </div>

                  {/* Product Title */}
                  <h2 className="font-extrabold text-base sm:text-lg text-neutral-900 tracking-tight leading-snug line-clamp-2 min-h-[3rem] mb-2">
                    {product.name}
                  </h2>

                  {/* Rating Stars (★★★★★ 4.4) */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-black text-sm tracking-tighter select-none font-black">
                      ★★★★★
                    </span>
                    <span className="text-xs font-bold text-neutral-800">
                      {product.rating || 4.4}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3 mb-6">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Card Footer: Price & View CTA */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-neutral-900">
                      {formatPrice(product.price)}
                    </span>
                    {hasOriginalPrice && (
                      <span className="text-xs sm:text-sm text-neutral-400 line-through font-medium">
                        {formatPrice(product.originalPrice!)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectProduct(product)}
                    id={`view-btn-${product.id}`}
                    className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-extrabold text-xs sm:text-sm transition-all shadow-xs hover:shadow flex items-center gap-1 hover:gap-1.5 cursor-pointer active:scale-95"
                    aria-label={`View details for ${product.name}`}
                  >
                    <span>{isHomepage ? 'Dekho' : 'View'}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Benefits Strip matching User Instruction 4 */}
      {!hideBottomStrip && (
        <div className="border-t border-neutral-200/80 bg-white py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-neutral-700">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-neutral-900 shrink-0" />
              <span>Free delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-neutral-900 shrink-0" />
              <span>Cash on delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-neutral-900 shrink-0" />
              <span>60-day returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
              <span>1-year warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-neutral-900 text-neutral-900 shrink-0" />
              <span>950,000+ tags active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
