import React, { useState } from 'react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { useRouter } from '../context/RouterContext';
import { AppDownloadBadges } from './AppDownloadBadges';
import { 
  Instagram, 
  Facebook, 
  MessageCircle, 
  ChevronDown, 
  MapPin,
  Mail,
  Phone,
  Download
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [guidesOpen, setGuidesOpen] = useState(false);
  const { navigate } = useRouter();

  const guides = [
    "Why Sampark Tag Should Come Standard With Every Car in Delhi",
    "How to Contact a Parked Car Owner Without Knowing Their Phone Number",
    "Sampark Tag vs Leaving Mobile Number on Dashboard",
    "Why Fleet Vehicles and Society RWAs Need Privacy Contact",
    "How Car Sampark Tag Prevents Parking Disputes in Tight Societies",
    "How to Setup and Activate Your Free Digital eTag"
  ];

  return (
    <footer className="bg-[#111111] text-white border-t border-neutral-900">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 text-left">
          
          {/* Brand & Social Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFE600] text-black font-extrabold text-base flex items-center justify-center">
                S
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  SAMPARK
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-[#FFE600]">
                  DELHI
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              Privacy-first smart contact tags for cars, bikes, and homes. Masked calls and WhatsApp alerts without exposing your personal phone number.
            </p>

            {/* Official Social Links */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2.5">
                <a
                  href={BUSINESS_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-[#FFE600] hover:text-black text-gray-300 border border-neutral-800 flex items-center justify-center transition-all"
                  aria-label="Instagram @samparkme.delhi"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href={BUSINESS_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-[#FFE600] hover:text-black text-gray-300 border border-neutral-800 flex items-center justify-center transition-all"
                  aria-label="Facebook @samparkme.delhi"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-emerald-500 hover:text-white text-gray-300 border border-neutral-800 flex items-center justify-center transition-all"
                  aria-label="WhatsApp +91 84477 77266"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-gray-400">
                Official handles: <strong className="text-white">@samparkme.delhi</strong>
              </p>
            </div>

            {/* Mobile App Download - Bold & Visible with Authentic Logos */}
            <div className="pt-2">
              <AppDownloadBadges />
            </div>
          </div>

          {/* Quick Pages Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-gray-300 font-medium">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-[#FFE600] transition-colors text-left cursor-pointer font-bold text-white flex items-center gap-1.5">
                  <span>Shop Tags</span>
                  <span className="text-[10px] bg-[#FFE600] text-black px-1.5 py-0.2 rounded font-black">3</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shark-tank')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Shark Tank Pitch
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Contact Hub
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/distributorship')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Distributorship
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cart')} className="hover:text-white transition-colors text-left cursor-pointer text-[#FFE600]">
                  Cart &amp; Checkout
                </button>
              </li>
              <li>
                <a
                  href="/sampark-official-brochure.pdf"
                  download="Sampark-Car-Tag-Official-Brochure.pdf"
                  className="hover:text-white transition-colors text-left cursor-pointer text-[#FFE600] flex items-center gap-1.5"
                  title="Download Official 2-Page Brochure (PDF)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Brochure (PDF)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Products Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Products
            </h4>
            <ul className="space-y-2 text-xs text-gray-300 font-medium">
              <li>
                <button onClick={() => navigate('/shop/car-sampark-tag-pack-2')} className="hover:text-white transition-colors text-left cursor-pointer">
                  (Pack of 2) Car Tag · ₹499
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop/2-ngf132-bike-tags')} className="hover:text-white transition-colors text-left cursor-pointer">
                  2 Bike Tags (Bike + Helmet) · ₹499
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop/car-bike-sampark-tag')} className="hover:text-white transition-colors text-left cursor-pointer">
                  (Pack of 1) Car Tag · ₹499
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-[#FFE600] transition-colors text-left cursor-pointer font-bold text-[#FFE600]">
                  Browse All Tags →
                </button>
              </li>
            </ul>
          </div>

          {/* Official Contact Info - Pinned to Narela */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Official Contact
            </h4>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FFE600] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 text-[11px] block">Narela Hub Address:</span>
                  <span className="text-white font-medium leading-relaxed">{BUSINESS_CONFIG.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFE600] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 text-[11px] block">WhatsApp &amp; Support:</span>
                  <a href={`tel:${BUSINESS_CONFIG.phoneRaw}`} className="font-bold text-white hover:underline">
                    {BUSINESS_CONFIG.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FFE600] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 text-[11px] block">Email:</span>
                  <a href={`mailto:${BUSINESS_CONFIG.email}`} className="font-bold text-white hover:underline">
                    {BUSINESS_CONFIG.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FAQ Accordion */}
        <div className="mt-10 pt-5 border-t border-neutral-900">
          <button
            onClick={() => setGuidesOpen(!guidesOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 hover:text-white py-1 cursor-pointer"
          >
            <span>Delhi Automotive Privacy Guides &amp; Articles</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${guidesOpen ? 'rotate-180' : ''}`} />
          </button>

          {guidesOpen && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400 py-2">
              {guides.map((g, i) => (
                <div key={i} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  • {g}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© 2026 Sampark Delhi. All rights reserved. Indian Patent Protected Smart Contact System.</p>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery Pan-India</span>
            <span>·</span>
            <span>Zero Advance Payment</span>
            <span>·</span>
            <span className="text-[#FFE600]">Narela, Delhi</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
