import React from 'react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { AppDownloadBadges } from './AppDownloadBadges';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface HeroProps {
  onOpenOrderModal: () => void;
  onExploreProducts?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal }) => {
  const scrollToHow = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Copy & Actions (Screenshot 4 exact layout) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Black Pill with Gold Star */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-semibold shadow-xs">
              <span className="text-[#FFE600] font-bold">★</span>
              <span>Shark Tank India · Season 5 par dekha gaya</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-black tracking-tight leading-[1.08]">
              Ab koi bhi aapse contact kar sakta hai —<br />
              bina aapka number jaane!
            </h1>

            {/* Sub-headline (2 concise sentences) */}
            <p className="text-lg text-gray-600 font-normal leading-relaxed max-w-xl">
              Apni car ya bike par Sampark tag lagao. Agar kabhi koi dikkat ho, toh log isko scan karke aapse masked call par baat kar sakte hain. Aapka number poori tarah private rehta hai.
            </p>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenOrderModal}
                className="px-8 py-4 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-extrabold text-base transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
              >
                <span>Tags khareedo · from ₹499</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={scrollToHow}
                className="text-black font-semibold text-base hover:underline transition-all flex items-center gap-1.5 px-2 py-2 cursor-pointer"
              >
                <span>Dekho ye kaise kaam karta hai</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro-Trust Indicator */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1 text-black font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                Verified Delhi Hub Dispatch
              </span>
              <span>·</span>
              <span>100% Privacy Protected</span>
              <span>·</span>
              <span className="text-gray-900 font-semibold">Cash on Delivery Available</span>
            </div>

            {/* App Store & Marketplace Row matching provided image */}
            <div className="pt-6 border-t border-gray-100">
              <AppDownloadBadges />
            </div>

          </div>

          {/* Right Column: High-Res Real Product Image without any cut or crop */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-none flex flex-col items-center">
              
              {/* Subtle ambient yellow circular accent */}
              <div className="absolute -top-6 -right-6 w-56 h-56 rounded-full bg-[#FFE600]/30 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-full bg-neutral-200/50 blur-xl pointer-events-none" />

              {/* Uncropped Image Display Container */}
              <div className="relative z-10 w-full rounded-2xl sm:rounded-3xl bg-neutral-50/90 p-2 sm:p-3 border border-neutral-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                <img
                  src="https://i.ibb.co/Qy1T0DT/image.png"
                  alt="Sampark Smart Vehicle Privacy Tag"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain rounded-xl sm:rounded-2xl max-h-[640px] select-none shadow-xs"
                  loading="eager"
                />
              </div>

              {/* Tag Trust Strip beneath image */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold text-neutral-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Privacy Protected</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE600] text-black font-bold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Official Sampark Tag</span>
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
