import React, { useState } from 'react';
import { Order } from '../types';
import { 
  CheckCircle, 
  Copy, 
  Check, 
  MessageCircle, 
  Clock, 
  Package, 
  User, 
  MapPin, 
  X
} from 'lucide-react';

interface OrderConfirmationProps {
  order: Order;
  whatsappAdminUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  whatsappAdminUrl,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-[#111111] text-white p-6 sm:p-7 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-[#FFE600] border-2 border-[#FFE600] flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFE600] block mb-1">
            Order Request Submitted
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Order Successfully Placed
          </h2>
          <p className="mt-1.5 text-xs text-gray-400 max-w-md mx-auto">
            Our Delhi fulfillment team will dispatch your tag. Cash on delivery.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-4 text-left">
          
          {/* Order ID Copy Box */}
          <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                Order ID
              </span>
              <span className="font-mono text-base font-extrabold text-black">
                {order.id}
              </span>
            </div>

            <button
              onClick={copyOrderId}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:text-black flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Details list */}
          <div className="text-xs space-y-1 bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" /> Customer:
              </span>
              <span className="font-bold text-gray-900">
                {order.customerName}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-gray-400" /> Product:
              </span>
              <span className="font-bold text-gray-900 text-right">
                {order.productName} (Qty: {order.quantity})
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Total Payable:</span>
              <span className="font-extrabold text-emerald-700 text-sm">
                ₹{order.totalAmount} (COD)
              </span>
            </div>

            <div className="flex items-start justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-1.5 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-gray-400" /> Delivery:
              </span>
              <span className="font-medium text-gray-800 text-right max-w-xs">
                {order.address}, {order.city} - {order.pincode}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> Date:
              </span>
              <span className="font-medium text-gray-700">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500">Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                {order.status}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <a
              href={whatsappAdminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-full bg-[#FFE600] hover:bg-[#F5D800] text-black font-extrabold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-black" />
              <span>Confirm on Official WhatsApp (+91 84477 77266)</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Close &amp; Continue Browsing</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
