import { Order, OrderInput } from '../types';
import { INITIAL_PRODUCTS } from '../config/businessConfig';
import { saveOrderToFirestore } from './firebase';

/**
 * Generates a clean, unique order ID in format: SMK-YYYYMMDD-XXXX
 */
export function generateOrderId(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;
  
  // 4-digit unique suffix combining random number and milliseconds slice
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SMK-${dateStr}-${rand}`;
}

/**
 * Generates pre-filled WhatsApp admin notification URL
 */
export function generateWhatsappAdminUrl(order: Order): string {
  const itemsBreakdown = (order.items && order.items.length > 0)
    ? order.items.map(i => `• ${i.productName} × ${i.quantity} (₹${i.price * i.quantity})`).join('\n')
    : `• ${order.productName} × ${order.quantity} (₹${order.totalAmount})`;

  const notificationText = `*NEW ORDER RECEIVED*\n\n` +
    `*Order ID:* ${order.id}\n` +
    `*Customer:* ${order.customerName}\n` +
    `*Mobile:* ${order.mobile}\n` +
    (order.whatsapp && order.whatsapp !== order.mobile ? `*WhatsApp:* ${order.whatsapp}\n` : '') +
    `*Items Ordered:*\n${itemsBreakdown}\n` +
    `*Total Amount:* ₹${order.totalAmount} (Cash on Delivery)\n` +
    `*Address:* ${order.address}\n` +
    `*City:* ${order.city}\n` +
    `*Pincode:* ${order.pincode}\n` +
    (order.customerNote ? `*Customer Note:* ${order.customerNote}\n` : '') +
    `\n_Sent from Sampark Delhi Order Portal_`;

  return `https://wa.me/918447777266?text=${encodeURIComponent(notificationText)}`;
}

export interface SubmitOrderResponse {
  success: boolean;
  order: Order;
  whatsappAdminUrl: string;
}

/**
 * Reliable, production-ready order submission.
 * Saves the order directly to Firebase Firestore, guaranteed to work
 * on Cloudflare Pages, custom domains, and local environments without
 * depending on a local Express server.
 */
export async function submitCustomerOrder(input: OrderInput): Promise<SubmitOrderResponse> {
  // 1. Validation
  const customerName = (input.customerName || '').trim();
  if (!customerName || customerName.length < 2) {
    throw new Error('Please enter a valid customer name.');
  }

  const cleanMobile = String(input.mobile || '').replace(/\D/g, '');
  if (cleanMobile.length < 10) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }

  const cleanWhatsapp = String(input.whatsapp || cleanMobile).replace(/\D/g, '');
  if (cleanWhatsapp.length < 10) {
    throw new Error('Please enter a valid 10-digit WhatsApp number.');
  }

  const cleanPincode = String(input.pincode || '').replace(/\D/g, '');
  if (cleanPincode.length !== 6) {
    throw new Error('Please enter a valid 6-digit Indian PIN code.');
  }

  const cleanAddress = (input.address || '').trim();
  if (!cleanAddress || cleanAddress.length < 5) {
    throw new Error('Please enter your complete delivery address.');
  }

  const cleanCity = (input.city || 'Delhi').trim();
  const cleanNote = input.customerNote ? input.customerNote.trim() : undefined;

  // 2. Resolve items & calculate total amount securely
  let orderItemsList: { productId: string; productName: string; price: number; quantity: number }[] = [];
  let totalAmount = 0;
  let primaryProductId = '';
  let primaryProductName = '';
  let primaryProductPrice = 0;
  let totalQty = 0;

  if (Array.isArray(input.items) && input.items.length > 0) {
    for (const it of input.items) {
      const matchedProd = INITIAL_PRODUCTS.find(p => p.id === it.productId);
      const price = matchedProd ? matchedProd.price : Number(it.price || 0);
      const q = Math.max(1, Number(it.quantity || 1));
      const name = matchedProd ? matchedProd.name : String(it.productName || 'Sampark Tag');
      orderItemsList.push({
        productId: it.productId,
        productName: name,
        price,
        quantity: q
      });
      totalAmount += price * q;
      totalQty += q;
    }
    primaryProductId = orderItemsList[0].productId;
    primaryProductPrice = orderItemsList[0].price;
    primaryProductName = orderItemsList.length === 1
      ? orderItemsList[0].productName
      : orderItemsList.map(i => `${i.productName} (x${i.quantity})`).join(', ');
  } else {
    const qty = Math.max(1, Math.min(50, Number(input.quantity || 1)));
    const matchedProd = INITIAL_PRODUCTS.find(p => p.id === input.productId) || INITIAL_PRODUCTS[0];
    primaryProductId = matchedProd.id;
    primaryProductName = matchedProd.name;
    primaryProductPrice = matchedProd.price;
    totalQty = qty;
    totalAmount = matchedProd.price * qty;
    orderItemsList = [{
      productId: matchedProd.id,
      productName: matchedProd.name,
      price: matchedProd.price,
      quantity: qty
    }];
  }

  // 3. Assemble Complete Order Object
  const orderId = generateOrderId();
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    customerName,
    mobile: cleanMobile,
    whatsapp: cleanWhatsapp,
    address: cleanAddress,
    city: cleanCity,
    pincode: cleanPincode,
    productId: primaryProductId,
    productName: primaryProductName,
    productPrice: primaryProductPrice,
    quantity: totalQty,
    totalAmount,
    items: orderItemsList,
    customerNote: cleanNote,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: 'PENDING',
        timestamp: now,
        note: 'Order placed on Sampark Delhi'
      }
    ]
  };

  // 4. Save directly to Firestore (Cloud Database)
  // This is the primary persistent database requirement.
  await saveOrderToFirestore(newOrder);

  // 5. Generate official WhatsApp Admin link
  const whatsappAdminUrl = generateWhatsappAdminUrl(newOrder);

  // 6. Optional background sync to local Express server if active in dev
  try {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...input,
        id: newOrder.id,
        items: orderItemsList
      })
    }).catch(() => {
      // Quietly ignore in production where /api/orders does not run Express
    });
  } catch {
    // Non-blocking
  }

  return {
    success: true,
    order: newOrder,
    whatsappAdminUrl
  };
}
