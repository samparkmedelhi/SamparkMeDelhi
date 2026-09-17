import React from 'react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { MapPin, Phone, Mail, MessageCircle, ExternalLink, Clock } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const narelaAddress = "Sukar bazar road , near smriti van park , pkt.-11, secA-6 NARELA DELHI - 110040";
  const mapsEmbedUrl = "https://maps.google.com/maps?q=Sukar+bazar+road+,+near+smriti+van+park+,+pkt.-11,+secA-6+NARELA+DELHI+-+110040&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section id="contact-hub" className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-2xl mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
            DELHI OPERATIONS &amp; HUB
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
            Sampark Delhi Hub
          </h2>
          <p className="mt-2 text-base text-gray-600">
            Official Delhi office and dispatch center in Narela, Delhi. Contact us for customer support, dispatch inquiries, and fleet partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#fafafa] rounded-3xl p-6 sm:p-8 border border-gray-200/80 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-6">
              
              {/* Pinned Narela Location */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE600] text-black shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Official Location (Narela, Delhi)</h3>
                  <p className="text-sm font-bold text-black mt-1 leading-snug">
                    {narelaAddress}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    North Delhi fulfillment and pickup hub
                  </p>
                </div>
              </div>

              {/* WhatsApp / Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-black shadow-xs border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Phone &amp; WhatsApp</h3>
                  <a
                    href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                    className="text-base font-extrabold text-black hover:underline block mt-0.5"
                  >
                    {BUSINESS_CONFIG.phone}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Live chat support 7 days a week
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-black shadow-xs border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Email Address</h3>
                  <a
                    href={`mailto:${BUSINESS_CONFIG.email}`}
                    className="text-sm font-bold text-black hover:underline block mt-0.5"
                  >
                    {BUSINESS_CONFIG.email}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Official business &amp; corporate inquiries
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-black shadow-xs border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Operations Schedule</h3>
                  <p className="text-sm font-semibold text-black mt-0.5">
                    Mon - Sat: 9:30 AM – 7:30 PM IST
                  </p>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    Online dispatch &amp; order booking active 24/7
                  </p>
                </div>
              </div>

            </div>

            {/* Direct Action Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-2.5">
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsappRaw}?text=Hello%20Sampark%20Delhi%2C%20I%20would%20like%20to%20connect%20with%20your%20Narela%20hub.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Message on WhatsApp (+91 84477 77266)</span>
              </a>

              <a
                href={BUSINESS_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-black" />
                <span>Open Narela Location in Google Maps</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>

          </div>

          {/* Interactive Google Map Embed centered on Narela */}
          <div className="lg:col-span-7 bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-xs min-h-[360px] relative">
            <iframe
              title="Sampark Delhi Narela Hub Location"
              className="w-full h-full min-h-[380px] border-0"
              src={mapsEmbedUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full shadow-xs text-xs font-bold text-black border border-gray-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE600]"></span>
              <span>Narela, Delhi 110040</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
