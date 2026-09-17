import React, { useState } from 'react';
import { Product } from '../types';
import { getProductEnquiryUrl } from '../config/businessConfig';
import { Check, ArrowRight, MessageCircle, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';

interface ProductCardProps {
  product: Product;
  onOrderNow?: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOrderNow,
  onViewDetails
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();
  const { navigate } = useRouter();
  const whatsappUrl = getProductEnquiryUrl(product.name);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOrderNow) {
      onOrderNow(product);
    } else {
      addToCart(product, 1);
      navigate('/cart');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col h-full group">
      
      {/* Image Container with Badge */}
      <div className="relative h-52 sm:h-60 bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {product.badge && (
          <div className="absolute top-3 left-3 bg-black text-[#FFE600] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
            {product.badge}
          </div>
        )}

        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-black text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-gray-200">
            Save ₹{product.originalPrice - product.price}
          </div>
        )}

        {/* View Details Overlay */}
        <button
          onClick={() => onViewDetails(product)}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          aria-label={`View details for ${product.name}`}
        >
          <span className="bg-white text-black px-3.5 py-1.5 rounded-full text-xs font-bold shadow flex items-center gap-1.5 hover:bg-[#FFE600] transition-colors">
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-black tracking-tight leading-snug">
            {product.name}
          </h3>

          <p className="mt-1.5 text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Pricing */}
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-black">
              {product.price === 0 ? 'Free' : `₹${product.price}`}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-medium text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {product.price === 0 ? 'Instant Download' : 'COD Available'}
            </span>
          </div>

          {/* Features */}
          <div className="mt-3.5 space-y-1.5 border-t border-gray-100 pt-3">
            {product.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleBuyNow}
              className="w-full py-2.5 px-3 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{product.price === 0 ? 'Free eTag' : 'Order COD'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-2 rounded-full border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                justAdded 
                  ? 'bg-black text-[#FFE600] border-black' 
                  : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onViewDetails(product)}
              className="text-xs font-semibold text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              Specifications →
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
