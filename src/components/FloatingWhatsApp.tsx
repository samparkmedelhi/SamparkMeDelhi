import React, { useState } from 'react';
import { BUSINESS_CONFIG, getGeneralEnquiryUrl } from '../config/businessConfig';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickLinks = [
    {
      title: "Order a Smart Tag",
      desc: "Instant booking assistance",
      message: "Hello! I would like to book a Sampark Smart Tag."
    },
    {
      title: "Vehicle Parking Issue",
      desc: "Emergency or blocked car help",
      message: "Hello, I want to inquire about masked calling for my car."
    },
    {
      title: "Society & Bulk Kits",
      desc: "RWA & Corporate orders",
      message: "Hello! I am inquiring about bulk society/fleet parking tags."
    }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Contextual Quick Popup */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          
          {/* Header */}
          <div className="bg-[#161615] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs leading-tight">Sampark Delhi WhatsApp</h4>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Official: +91 84477 77266
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1"
              aria-label="Close WhatsApp Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick options */}
          <div className="p-3 space-y-2 text-xs bg-[#fbfbfa]">
            <p className="text-[11px] text-neutral-500 font-medium px-1">
              Select a quick inquiry or start chat:
            </p>

            {quickLinks.map((item, idx) => (
              <a
                key={idx}
                href={`https://wa.me/${BUSINESS_CONFIG.whatsappRaw}?text=${encodeURIComponent(item.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block p-2.5 rounded-xl bg-white hover:bg-emerald-50/70 border border-neutral-200/80 hover:border-emerald-300 transition-colors group"
              >
                <div className="font-bold text-neutral-900 group-hover:text-emerald-800 flex items-center justify-between">
                  <span>{item.title}</span>
                  <Send className="w-3 h-3 text-neutral-400 group-hover:text-emerald-600" />
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</div>
              </a>
            ))}

            <a
              href={getGeneralEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold rounded-xl transition-colors shadow-xs"
            >
              Open Direct WhatsApp Chat
            </a>
          </div>

        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Chat with Sampark Delhi on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="font-extrabold text-xs sm:text-sm tracking-tight hidden sm:inline">
          Chat on WhatsApp
        </span>
        <span className="w-2 h-2 rounded-full bg-white animate-ping sm:hidden"></span>
      </button>

    </div>
  );
};
