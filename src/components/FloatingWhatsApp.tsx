import React from 'react';
import { BUSINESS_CONFIG, getGeneralEnquiryUrl } from '../config/businessConfig';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Floating Main Button - Direct WhatsApp Link */}
      <a
        id="floating-whatsapp-btn"
        href={getGeneralEnquiryUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer no-underline"
        aria-label="Chat with Sampark Delhi on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="font-extrabold text-xs sm:text-sm tracking-tight hidden sm:inline">
          Chat on WhatsApp
        </span>
        <span className="w-2 h-2 rounded-full bg-white animate-ping sm:hidden"></span>
      </a>
    </div>
  );
};

