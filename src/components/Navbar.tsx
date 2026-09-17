import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { 
  Menu, 
  X, 
  ShoppingBag,
  ArrowRight,
  Download
} from 'lucide-react';

interface NavbarProps {
  onQuickBuy?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onQuickBuy }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPath, navigate } = useRouter();
  const { totalItems } = useCart();

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
      {/* Main navigation - No top black bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          aria-label="Sampark Delhi Homepage"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFE600] flex items-center justify-center text-black font-extrabold text-lg shadow-xs group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-black">
              SAMPARK
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black text-[#FFE600]">
              DELHI
            </span>
          </div>
        </button>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-700">
          <button
            onClick={() => handleNav('/')}
            className={`transition-colors cursor-pointer ${currentPath === '/' ? 'text-black font-bold' : 'hover:text-black'}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/shop')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${currentPath.startsWith('/shop') || currentPath.startsWith('/product') ? 'text-black font-extrabold border-b-2 border-black pb-0.5' : 'hover:text-black font-semibold'}`}
          >
            <span>Shop</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#FFE600] text-black">
              TAGS
            </span>
          </button>
          <button
            onClick={() => handleNav('/shark-tank')}
            className={`transition-colors cursor-pointer ${currentPath === '/shark-tank' ? 'text-black font-bold' : 'hover:text-black'}`}
          >
            Shark Tank
          </button>
          <button
            onClick={() => handleNav('/contact')}
            className={`transition-colors cursor-pointer ${currentPath === '/contact' ? 'text-black font-bold' : 'hover:text-black'}`}
          >
            Contact &amp; Hub
          </button>
          <a
            href="/sampark-official-brochure.pdf"
            download="Sampark-Car-Tag-Official-Brochure.pdf"
            className="transition-colors hover:text-black flex items-center gap-1.5 text-neutral-700 hover:text-black font-semibold text-xs py-1 px-2.5 rounded-full bg-neutral-100 hover:bg-[#FFE600] border border-neutral-200 cursor-pointer shadow-2xs"
            title="Download Official 2-Page Brochure PDF"
          >
            <Download className="w-3.5 h-3.5 text-neutral-900" />
            <span>Brochure</span>
          </a>
        </nav>

        {/* Action CTAs (Cart + Buy Now Pill) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart button */}
          <button
            onClick={() => handleNav('/cart')}
            className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-[#FFE600] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('/shop')}
            className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-bold text-sm transition-all shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Shop Tags</span>
            <span className="text-xs opacity-75">· from ₹399</span>
          </button>
        </div>

        {/* Mobile menu and cart button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => handleNav('/cart')}
            className="relative p-2 text-gray-800 hover:text-black focus:outline-none"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-black text-[#FFE600] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('/shop')}
            className="px-3.5 py-1.5 rounded-full bg-[#FFE600] text-black font-bold text-xs"
          >
            Shop
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-800 hover:text-black focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-5 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 font-medium text-gray-800 text-sm">
            <button
              onClick={() => handleNav('/')}
              className={`text-left py-2.5 border-b border-gray-100 flex items-center justify-between ${currentPath === '/' ? 'font-bold text-black' : ''}`}
            >
              <span>Home</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => handleNav('/shop')}
              className={`text-left py-2.5 border-b border-gray-100 flex items-center justify-between ${currentPath.startsWith('/shop') ? 'font-bold text-black' : ''}`}
            >
              <span className="flex items-center gap-2">
                <span>Shop Tags</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FFE600] text-black text-[10px] font-black">
                  3 Products
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => handleNav('/shark-tank')}
              className={`text-left py-2.5 border-b border-gray-100 flex items-center justify-between ${currentPath === '/shark-tank' ? 'font-bold text-black' : ''}`}
            >
              <span>Shark Tank Season 5</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className={`text-left py-2.5 border-b border-gray-100 flex items-center justify-between ${currentPath === '/contact' ? 'font-bold text-black' : ''}`}
            >
              <span>Contact &amp; Hub (Narela, Delhi)</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
            <a
              href="/sampark-official-brochure.pdf"
              download="Sampark-Car-Tag-Official-Brochure.pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2.5 border-b border-gray-100 flex items-center justify-between font-semibold text-neutral-900"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-black" />
                <span>Download Brochure (PDF)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FFE600] text-black text-[10px] font-black">
                2 PAGES
              </span>
            </a>
            <button
              onClick={() => handleNav('/cart')}
              className={`text-left py-2.5 border-b border-gray-100 flex items-center justify-between ${currentPath === '/cart' ? 'font-bold text-black' : ''}`}
            >
              <span className="flex items-center gap-2">
                <span>Your Cart</span>
                {totalItems > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFE600] text-black text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleNav('/shop');
              }}
              className="w-full py-3 text-center text-sm font-bold rounded-full bg-[#FFE600] text-black shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Shop All Tags · From ₹399</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
