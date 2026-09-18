import React from 'react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { 
  MessageCircle, 
  Building2, 
  Package, 
  TrendingUp, 
  ShieldCheck, 
  Phone, 
  Mail, 
  ExternalLink,
  MapPin
} from 'lucide-react';

export const DistributorshipPage: React.FC = () => {
  const whatsappDistributorMessage = encodeURIComponent(
    "Hello Sampark Delhi, I am interested in becoming a distributor / dealer and would like to discuss bulk purchasing and business opportunities."
  );
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappRaw}?text=${whatsappDistributorMessage}`;

  return (
    <div className="py-12 sm:py-20 bg-[#fafafa] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Badge & Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-black bg-[#FFE600] px-3.5 py-1 rounded-full inline-block mb-3.5 shadow-2xs">
            B2B &amp; PARTNERSHIP PROGRAM
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight">
            Become a Distributor
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Partner with Sampark Delhi to bring privacy-first smart QR vehicle tags to your city or retail network. We offer attractive margins, dedicated support, and fast dispatch for dealers, auto-accessory shops, and bulk purchasers.
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-2xs">
            <MessageCircle className="w-7 h-7 fill-emerald-600/20" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-3">
            Ready to Do Business With Us?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Connect directly with our Delhi dealership &amp; partnerships team on WhatsApp to discuss dealer pricing, MOQ, marketing collateral, and regional territory distribution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              id="distributor-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm sm:text-base transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Connect on WhatsApp</span>
              <ExternalLink className="w-4 h-4 opacity-75" />
            </a>

            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-neutral-600" />
              <span>Call: {BUSINESS_CONFIG.phone}</span>
            </a>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Direct Line: {BUSINESS_CONFIG.phone} · Monday to Saturday (9:30 AM – 7:30 PM IST)
          </p>
        </div>

        {/* Distributor Opportunities / Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-left">
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFE600] flex items-center justify-center text-black font-bold mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-black text-base mb-1.5">
              Attractive Margins
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Competitive wholesale tiered pricing ensuring strong ROI and healthy profit margins on every smart tag sold.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-black text-base mb-1.5">
              Bulk &amp; Society Orders
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Custom bulk packages for RWAs, corporate office parks, vehicle fleets, and automotive accessory retailers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-black text-base mb-1.5">
              Delhi Hub Dispatch
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Fast, reliable fulfillment directly from our Narela Delhi warehouse with ready inventory and pan-India express courier.
            </p>
          </div>
        </div>

        {/* Direct Contact Details Box */}
        <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFE600]">
              Official Headquarters &amp; Warehouse
            </span>
            <h4 className="text-lg font-bold text-white">
              Sampark Delhi B2B Division
            </h4>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#FFE600] shrink-0" />
              <span>Narela, Delhi - 110040</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${BUSINESS_CONFIG.email}?subject=${encodeURIComponent("Distributorship & Bulk Purchase Inquiry - Sampark Delhi")}`}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#FFE600]" />
              <span>{BUSINESS_CONFIG.email}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black text-xs font-extrabold transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
