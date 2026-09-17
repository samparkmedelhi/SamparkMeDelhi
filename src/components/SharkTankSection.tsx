import React, { useState } from 'react';
import { ArrowRight, ExternalLink, Play, AlertCircle } from 'lucide-react';

interface SharkTankSectionProps {
  onOpenOrderModal?: () => void;
}

export const SharkTankSection: React.FC<SharkTankSectionProps> = ({ onOpenOrderModal }) => {
  const [iframeError, setIframeError] = useState(false);
  const youtubeUrl = "https://youtu.be/gLERj3IT__I?si=P-tPiWEskToDS9QW";
  const embedUrl = "https://www.youtube-nocookie.com/embed/gLERj3IT__I?rel=0&modestbranding=1";

  return (
    <section id="shark-tank" className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block mb-3">
            ★ NATIONAL TELEVISION COMMENDATION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
            Shark Tank India · Season 5
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
            Watch our complete pitch on Shark Tank India. See how Sampark is solving vehicle parking disputes, road accidents, and phone privacy for millions of Indian drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Responsive Embedded YouTube Video Player */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-md bg-black border border-gray-200 aspect-video group">
              {!iframeError ? (
                <iframe
                  className="w-full h-full"
                  src={embedUrl}
                  title="Sampark Delhi on Shark Tank India Season 5"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onError={() => setIframeError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-6 text-center">
                  <AlertCircle className="w-10 h-10 text-[#FFE600] mb-3" />
                  <p className="text-sm font-semibold mb-3">
                    Video player restricted by browser settings.
                  </p>
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#FFE600] text-black font-bold text-xs inline-flex items-center gap-2 hover:bg-[#F5D800]"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Watch Directly on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Direct Watch & Share Fallback */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span>Full Uncut Episode Pitch</span>
              </span>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black font-semibold inline-flex items-center gap-1 transition-colors text-gray-700"
              >
                <span>Open in YouTube app</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Right Column: Story highlights & quick CTA */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#fafafa] border border-gray-200">
                <h3 className="font-extrabold text-sm text-black mb-1">
                  100% Privacy Protection
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Callers connect to your phone without seeing your 10-digit number. Avoid spam, harassment, and identity leaks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fafafa] border border-gray-200">
                <h3 className="font-extrabold text-sm text-black mb-1">
                  Zero App Required for Bystanders
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Anyone who scans the tag with their phone camera can immediately initiate a call or send a WhatsApp message.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fafafa] border border-gray-200">
                <h3 className="font-extrabold text-sm text-black mb-1">
                  Emergency Medical Contact
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  In case of an on-road accident, rescuers can alert your designated emergency family contacts instantly.
                </p>
              </div>
            </div>

            {onOpenOrderModal && (
              <div className="pt-2">
                <button
                  onClick={onOpenOrderModal}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-extrabold text-sm transition-all shadow-xs hover:shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Order Shark Tank Tag · ₹399</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
