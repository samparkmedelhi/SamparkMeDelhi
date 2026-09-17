import React from 'react';
import { Instagram, ExternalLink, Play } from 'lucide-react';
import { AppDownloadBadges } from './AppDownloadBadges';

export const VideoSection: React.FC = () => {
  const reelUrl = "https://www.instagram.com/reel/DdSyXmNiY__/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==";
  const embedUrl = "https://www.instagram.com/reel/DdSyXmNiY__/embed/";

  return (
    <section id="video-demo" className="py-16 sm:py-20 bg-[#fafafa] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Playable Instagram Reel Frame */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <div className="w-full max-w-[420px] bg-white rounded-3xl p-3 sm:p-4 border border-gray-200/90 shadow-md">
              
              {/* Instagram Reel Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-gray-100 mb-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-[1.5px] flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-pink-600" />
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-black block leading-tight">@sampark.me</span>
                    <span className="text-[10px] text-gray-500">Official Instagram Reel Demo</span>
                  </div>
                </div>

                <a
                  href={reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                >
                  <span>Open Reel</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </div>

              {/* Responsive Reel Video Container */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] w-full shadow-inner border border-gray-100">
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-0 block"
                  title="Sampark Official Instagram Reel Demonstration"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  scrolling="no"
                />
              </div>

              {/* Bottom Reel Action Bar */}
              <div className="mt-3 px-1 pt-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-700 font-medium text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Tap video to play with audio
                </span>
                <a
                  href={reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 font-bold text-[11px] inline-flex items-center gap-1"
                >
                  <span>Watch on Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Copy & Store Downloads */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              SEE IT IN ACTION
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
              Watch how Sampark keeps you reachable — privately.
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              From scan to masked call in seconds. Watch our official demonstration reel to see how any passerby or neighbor can connect with you safely without ever revealing your personal mobile digits.
            </p>

            <div className="pt-2">
              <AppDownloadBadges />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
