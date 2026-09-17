import React from 'react';
import { Lock, MessageSquare, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Screenshot 4 exact layout) */}
        <div className="text-left max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            HOW IT WORKS
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
            Three steps. That&apos;s the whole thing.
          </h2>
        </div>

        {/* 3 Step Flow with Yellow Number Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Step 01 */}
          <div className="p-7 rounded-2xl bg-[#fafafa] border border-gray-200/70 hover:border-gray-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FFE600] flex items-center justify-center font-extrabold text-black text-sm mb-5 shadow-xs">
              01
            </div>
            <h3 className="text-xl font-bold text-black mb-2">
              Scan the tag
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Anyone can scan the QR with a normal phone camera — no app needed.
            </p>
          </div>

          {/* Step 02 */}
          <div className="p-7 rounded-2xl bg-[#fafafa] border border-gray-200/70 hover:border-gray-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FFE600] flex items-center justify-center font-extrabold text-black text-sm mb-5 shadow-xs">
              02
            </div>
            <h3 className="text-xl font-bold text-black mb-2">
              They reach out
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              They send a message or place a call, right from the browser.
            </p>
          </div>

          {/* Step 03 */}
          <div className="p-7 rounded-2xl bg-[#fafafa] border border-gray-200/70 hover:border-gray-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FFE600] flex items-center justify-center font-extrabold text-black text-sm mb-5 shadow-xs">
              03
            </div>
            <h3 className="text-xl font-bold text-black mb-2">
              You stay private
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              You get a masked call, SMS or WhatsApp. Your number is never shared.
            </p>
          </div>

        </div>

        {/* 3 Value Proposition Cards (Screenshot 4 layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-gray-200/80 bg-white flex items-start gap-4 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-[#fafafa] flex items-center justify-center text-black shrink-0 border border-gray-200">
              <Lock className="w-5 h-5 text-black" />
            </div>
            <div>
              <h4 className="text-base font-bold text-black mb-1">
                Private contact
              </h4>
              <p className="text-sm text-gray-600 leading-snug">
                Your details are never visible to the person reaching you.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200/80 bg-white flex items-start gap-4 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-[#fafafa] flex items-center justify-center text-black shrink-0 border border-gray-200">
              <MessageSquare className="w-5 h-5 text-black" />
            </div>
            <div>
              <h4 className="text-base font-bold text-black mb-1">
                Masked calls + WhatsApp
              </h4>
              <p className="text-sm text-gray-600 leading-snug">
                Calls, SMS and WhatsApp routed through a private number.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200/80 bg-white flex items-start gap-4 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-[#fafafa] flex items-center justify-center text-black shrink-0 border border-gray-200">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <h4 className="text-base font-bold text-black mb-1">
                Instant eTag PDF
              </h4>
              <p className="text-sm text-gray-600 leading-snug">
                Get a digital tag on WhatsApp instantly. Works offline too.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
