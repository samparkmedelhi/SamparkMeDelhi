import React from 'react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ExternalLink, 
  Clock, 
  Instagram, 
  Facebook, 
  ShieldCheck,
  Building
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const narelaAddress = "Sukar bazar road , near smriti van park , pkt.-11, secA-6 NARELA DELHI - 110040";
  const mapsEmbedUrl = "https://maps.google.com/maps?q=Sukar+bazar+road+,+near+smriti+van+park+,+pkt.-11,+secA-6+NARELA+DELHI+-+110040&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="py-10 sm:py-16 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 bg-white px-3.5 py-1 rounded-full border border-gray-200 inline-block mb-3">
            DELHI OPERATIONS &amp; DISPATCH
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight">
            Contact Sampark Delhi Hub
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
            Reach our verified Delhi team for order inquiries, hardware pickup, fleet integration, and support. Pinned and operating from Narela, Delhi.
          </p>
        </div>

        {/* Top Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Official Location Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE600] flex items-center justify-center text-black shrink-0 shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                  Official Registered Office &amp; Hub
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-black mt-0.5 leading-snug">
                  Narela Fulfillment Center
                </h2>
                <p className="text-sm font-semibold text-gray-800 mt-2 leading-relaxed bg-[#fafafa] p-3 rounded-xl border border-gray-100">
                  {narelaAddress}
                </p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 aspect-16/10 relative">
              <iframe
                title="Sampark Delhi Narela Map"
                className="w-full h-full border-0"
                src={mapsEmbedUrl}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={BUSINESS_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#FFE600]" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>

              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsappRaw}?text=Hello%20Sampark%20Delhi%2C%20I%20am%20heading%20to%20your%20Narela%20hub.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Directions on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Details & Channels */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Phone & WhatsApp */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                    Customer Support &amp; WhatsApp
                  </span>
                  <a
                    href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                    className="text-xl font-extrabold text-black hover:underline"
                  >
                    {BUSINESS_CONFIG.phone}
                  </a>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Connect with our dedicated Delhi support desk for order updates, tag replacement, or bulk orders.
              </p>
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsappRaw}?text=Hello%20Sampark%20Delhi%20team%2C%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>

            {/* Email & Business Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                    Official Email
                  </span>
                  <a
                    href={`mailto:${BUSINESS_CONFIG.email}`}
                    className="text-base sm:text-lg font-bold text-black hover:underline"
                  >
                    {BUSINESS_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-600">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Operating hours: Monday – Saturday (9:30 AM – 7:30 PM IST)</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                Official Social Media
              </span>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={BUSINESS_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-gray-200 hover:border-black text-xs font-bold text-gray-800 hover:text-black transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram: {BUSINESS_CONFIG.instagram}</span>
                </a>

                <a
                  href={BUSINESS_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-gray-200 hover:border-black text-xs font-bold text-gray-800 hover:text-black transition-colors flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook: {BUSINESS_CONFIG.facebook}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
