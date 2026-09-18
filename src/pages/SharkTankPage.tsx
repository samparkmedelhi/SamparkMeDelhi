import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { 
  Play, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  PhoneOff, 
  Users, 
  Car,
  AlertCircle
} from 'lucide-react';

export const SharkTankPage: React.FC<{ products: Product[] }> = ({ products }) => {
  const [iframeError, setIframeError] = useState(false);
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const youtubeUrl = "https://youtu.be/gLERj3IT__I?si=P-tPiWEskToDS9QW";
  const embedUrl = "https://www.youtube-nocookie.com/embed/gLERj3IT__I?rel=0&modestbranding=1";

  const flagship = products.find(p => p.id === 'car-bike-tag') || products[0];

  const handleOrderSharkTankTag = () => {
    if (flagship) {
      addToCart(flagship, 1);
    }
    navigate('/cart');
  };

  return (
    <div className="py-10 sm:py-16 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero */}
        <div className="text-left max-w-3xl mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-black bg-[#FFE600] px-3.5 py-1 rounded-full inline-block mb-3 shadow-xs">
            ★ NATIONAL TELEVISION PRESENTATION
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
            As Seen on Shark Tank India · Season 5
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
            Watch the official uncut episode pitch. Discover how Sampark Delhi is protecting vehicle owners and eliminating parking conflicts across India without ever revealing personal phone numbers.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-8 shadow-xs mb-12 text-left">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-gray-200">
            {!iframeError ? (
              <iframe
                className="w-full h-full"
                src={embedUrl}
                title="Sampark on Shark Tank India Season 5"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={() => setIframeError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-6 text-center">
                <AlertCircle className="w-12 h-12 text-[#FFE600] mb-3" />
                <p className="text-base font-bold mb-3">
                  Embedded playback blocked by browser security settings.
                </p>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#FFE600] text-black font-bold text-sm inline-flex items-center gap-2 hover:bg-[#F5D800]"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Watch Directly on YouTube</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <strong className="text-black">Official Episode Stream</strong> · YouTube ID: gLERj3IT__I
            </span>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Open in YouTube App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Why the Sharks Appreciated the Concept */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <PhoneOff className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-black">Zero Number Leakage</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Leaving your phone number on your car windshield exposes women and families to harassment, scams, and unwanted callers. Sampark masks both numbers completely.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-black">No App Required to Call</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Anyone walking by your car can scan the tag with their standard phone camera or Google Lens. No app download or account creation needed for the scanner.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-black">Built for Indian Roads</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              High-durability 3M adhesive, scratch-proof acrylic coating, and weatherproof laminate that withstands Delhi summers and monsoons effortlessly.
            </p>
          </div>
        </div>

        {/* Shark Tank Tag Order Callout */}
        <div className="bg-black text-white rounded-3xl p-8 sm:p-12 text-left flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFE600] block">
              FEATURED PRODUCT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Get the Shark Tank Car &amp; Bike Tag
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Order today with 100% Cash on Delivery. Dispatched directly from our official Narela, Delhi center with lifetime free masked call forwarding.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-300 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero advance payment</span>
              </span>
              <span>·</span>
              <span>Free Delivery across India</span>
            </div>
          </div>

          <div className="shrink-0 space-y-3 w-full sm:w-auto text-center sm:text-right">
            <div className="text-2xl font-extrabold text-white">
              ₹499 <span className="text-sm font-normal text-gray-400 line-through">₹799</span>
            </div>
            <button
              onClick={handleOrderSharkTankTag}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-extrabold text-base transition-all shadow hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Order with Cash on Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
