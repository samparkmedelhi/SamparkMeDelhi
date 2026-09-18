import React from 'react';
import { Star, UserCheck } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      quote: "Ab dashboard par haath se number likhne ki koi zaroorat nahi. Log seedha tag scan karke bina mera number dekhe call kar lete hain.",
      author: "Verified Driver",
      city: "New Delhi"
    },
    {
      id: 2,
      quote: "Setup karne mein sirf 2 minute lage. Tag ki packaging badhiya thi aur QR scan karte hi turant activate ho gaya.",
      author: "Car Owner",
      city: "NCR"
    },
    {
      id: 3,
      quote: "Tight parking mein padosi aasaani se call kar lete hain bina mera personal mobile number permanently save kiye.",
      author: "Vehicle Owner",
      city: "Delhi"
    }
  ];

  return (
    <section className="py-14 sm:py-16 bg-[#fafafa] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left max-w-xl mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
            CUSTOMER REVIEWS
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Delhi NCR ke drivers ka bharosa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#FFE600] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFE600] text-[#FFE600]" />
                  ))}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-6 font-normal">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-black block">{rev.author}</span>
                  <span className="text-gray-400 text-[11px]">{rev.city}</span>
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  Verified Driver
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
