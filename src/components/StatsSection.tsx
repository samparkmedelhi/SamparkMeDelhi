import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StatsSectionProps {
  onOpenOrderModal: () => void;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ onOpenOrderModal }) => {
  return (
    <div>
      {/* High-Impact Yellow Banner without the 950000+ Active block */}
      <section className="bg-[#FFE600] text-black py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black">
            Park with privacy.
          </h2>
          <p className="text-lg sm:text-xl text-black/85 font-medium max-w-2xl mx-auto">
            Let people reach you safely on road — without ever sharing your mobile digits.
          </p>
          <div className="pt-3">
            <button
              onClick={onOpenOrderModal}
              className="px-8 py-4 rounded-full bg-black hover:bg-neutral-900 text-white font-bold text-base transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Buy the tag · ₹399</span>
              <ArrowRight className="w-4 h-4 text-[#FFE600]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
