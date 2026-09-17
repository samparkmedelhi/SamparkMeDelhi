import React, { useState } from 'react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { FileText, X, Download, ShieldCheck, Check } from 'lucide-react';

export const GooglePlayLogo: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.6 1.7C3.2 2.1 3 2.8 3 3.7v16.6c0 .9.2 1.6.6 2l10.3-10.3L3.6 1.7z"
      fill="#00C0FF"
    />
    <path
      d="M17.4 8.5l-3.5 3.5 3.5 3.5 4.3-2.5c.8-.5.8-1.5 0-2l-4.3-2.5z"
      fill="#FFD200"
    />
    <path
      d="M13.9 12L3.6 1.7c.3-.2.8-.2 1.3.1l12.5 7.2L13.9 12z"
      fill="#00E676"
    />
    <path
      d="M17.4 15.5l-12.5 7.2c-.5.3-1 .3-1.3.1L13.9 12l3.5 3.5z"
      fill="#FF3D00"
    />
  </svg>
);

export const AppleLogo: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.65-.89 1.72-.76 2.74.88.07 1.86-.49 2.48-1.24z" />
  </svg>
);

interface AppDownloadBadgesProps {
  className?: string;
  darkContainer?: boolean;
}

export const AppDownloadBadges: React.FC<AppDownloadBadgesProps> = ({
  className = "",
  darkContainer = false,
}) => {
  const [showBrochureModal, setShowBrochureModal] = useState(false);

  return (
    <>
      <div
        className={`flex flex-col gap-3 ${
          darkContainer
            ? 'p-4 sm:p-5 rounded-2xl bg-[#141412] border border-neutral-800 shadow-lg'
            : ''
        } ${className}`}
      >
        {/* Row 1: Google Play & App Store Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Google Play Button */}
          <a
            href={BUSINESS_CONFIG.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-4 py-2.5 rounded-xl bg-black border border-neutral-700/90 text-white hover:border-neutral-500 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center gap-3 shadow-md min-w-[168px]"
            aria-label="Get it on Google Play"
          >
            <GooglePlayLogo className="w-6 h-6 shrink-0 group-hover:scale-105 transition-transform" />
            <div className="text-left select-none">
              <span className="block text-[9px] uppercase tracking-wider text-white font-bold leading-none mb-0.5">
                GET IT ON
              </span>
              <span className="block text-[15px] font-extrabold text-white leading-tight tracking-tight">
                Google Play
              </span>
            </div>
          </a>

          {/* Download on the App Store Button */}
          <a
            href={BUSINESS_CONFIG.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-4 py-2.5 rounded-xl bg-black border border-neutral-700/90 text-white hover:border-neutral-500 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center gap-3 shadow-md min-w-[168px]"
            aria-label="Download on the App Store"
          >
            <AppleLogo className="w-6 h-6 shrink-0 text-white group-hover:scale-105 transition-transform" />
            <div className="text-left select-none">
              <span className="block text-[9px] tracking-tight text-white font-medium leading-none mb-0.5">
                Download on the
              </span>
              <span className="block text-[15px] font-extrabold text-white leading-tight tracking-tight">
                App Store
              </span>
            </div>
          </a>
        </div>

        {/* Row 2: Pills (Amazon · Brochure · YouTube) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
          <a
            href="https://www.amazon.in/s?k=sampark+car+tag+ngf132"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-1.5 rounded-full bg-[#232320] hover:bg-neutral-800 border border-neutral-700 text-[#E8E6DF] hover:text-white text-xs font-semibold tracking-wide transition-all shadow-2xs hover:scale-105 cursor-pointer"
          >
            Amazon
          </a>

          <a
            href="/sampark-official-brochure.pdf"
            download="Sampark-Car-Tag-Official-Brochure.pdf"
            onClick={() => setShowBrochureModal(true)}
            className="px-5 py-1.5 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black text-xs font-bold tracking-wide transition-all shadow-2xs hover:scale-105 cursor-pointer flex items-center gap-1.5"
            title="Download Official Sampark Brochure PDF"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Brochure (PDF)</span>
          </a>

          <a
            href="https://www.youtube.com/watch?v=gLERj3IT__I"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-1.5 rounded-full bg-[#232320] hover:bg-neutral-800 border border-neutral-700 text-[#E8E6DF] hover:text-white text-xs font-semibold tracking-wide transition-all shadow-2xs hover:scale-105 cursor-pointer"
          >
            YouTube
          </a>
        </div>
      </div>

      {/* Official Brochure Preview & Download Modal */}
      {showBrochureModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowBrochureModal(false)}
        >
          <div
            className="relative bg-[#FAF9F6] rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-left border border-neutral-300 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowBrochureModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer shadow-md"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Status Banner */}
            <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Brochure Download Started (2-Page Official PDF)</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Cover Preview Image */}
              <div className="w-full sm:w-44 shrink-0 rounded-2xl overflow-hidden border border-neutral-300 shadow-md bg-white">
                <img
                  src="https://i.ibb.co/Qy1T0DT/image.png"
                  alt="Sampark Brochure Cover Page 1"
                  className="w-full h-auto object-cover"
                />
                <div className="p-2 bg-neutral-900 text-white text-[10px] text-center font-bold">
                  Page 1 of 2 · Official Tag Guide
                </div>
              </div>

              {/* Right Content */}
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                  Car Sampark Tag Official Brochure
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600">
                  &ldquo;Let people call you for any issues with your parked car. A car with civic sense.&rdquo;
                </p>

                {/* Key Brochure Highlights */}
                <div className="space-y-2 bg-white p-4 rounded-xl border border-neutral-200 text-xs text-neutral-800">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-[#FFE600] text-black font-extrabold text-[11px] flex items-center justify-center shrink-0">1</span>
                    <span><strong>Page 1:</strong> Car Tag, Masked Calls, SMS &amp; WhatsApp, Helpline</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-[#FFE600] text-black font-extrabold text-[11px] flex items-center justify-center shrink-0">2</span>
                    <span><strong>Page 2:</strong> 4-Step &ldquo;How it works?&rdquo; &amp; &ldquo;Why Sampark?&rdquo; civic guide</span>
                  </div>
                  <div className="pt-1 text-[11px] text-neutral-500 border-t border-neutral-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Official Delhi Hub Dispatch (Narela 110040) · Call: +91 84477 77948</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <a
                    href="/sampark-official-brochure.pdf"
                    download="Sampark-Car-Tag-Official-Brochure.pdf"
                    className="px-5 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#F5D800] text-black text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs hover:shadow cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Again</span>
                  </a>

                  <a
                    href="/sampark-official-brochure.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Open in Tab
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
