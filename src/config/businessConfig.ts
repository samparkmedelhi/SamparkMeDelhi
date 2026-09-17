import { BusinessConfig, Product } from '../types';

export const BUSINESS_CONFIG: BusinessConfig = {
  name: "Sampark Delhi",
  brandTitle: "Sampark Delhi",
  tagline: "Let anyone reach you — without sharing your number.",
  phone: "+91 84477 77266",
  phoneRaw: "918447777266",
  whatsapp: "+91 84477 77266",
  whatsappRaw: "918447777266",
  email: "samparkme.delhi@gmail.com",
  instagram: "@samparkme.delhi",
  instagramUrl: "https://www.instagram.com/samparkme.delhi",
  facebook: "@samparkme.delhi",
  facebookUrl: "https://www.facebook.com/samparkme.delhi",
  address: "Sukar bazar road , near smriti van park , pkt.-11, secA-6 NARELA DELHI - 110040",
  addressDetails: "Sukar bazar road, near smriti van park, pkt.-11, secA-6, Narela, Delhi - 110040",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sukar+bazar+road+,+near+smriti+van+park+,+pkt.-11,+secA-6+NARELA+DELHI+-+110040",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.myapp.ngf132&pcampaignid=web_share",
  appStoreUrl: "https://apps.apple.com/app/sampark-delhi/id1562510071",
  sharkTankNotice: "★ As seen on Shark Tank India · Season 5",
  stats: {
    activeTags: "Verified Delhi Hub",
    revenueGrowth: "Pan-India Shipping",
    satisfaction: "100% Privacy Protected",
  },
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "car-sampark-tag-pack-2",
    name: "(Pack of 2) Car sampark tag, Let people call you for any issues with your parked car.",
    badge: "BEST SELLER",
    rating: 4.4,
    shortDescription: "We park our vehicles every day in public places, BUT have we ever thought if the parked vehicle is creating any issues and if it does how someone can reach us?",
    detailedDescription: "We park our vehicles every day in public places, BUT have we ever thought if the parked vehicle is creating any issues and if it does how someone can reach us? Many of us leave our contact number on windshields, which exposes personal phone numbers to strangers, spam callers, and harassment. Sampark Car Tag solves this with secure QR-masked calling. Anyone who scans your tag can call you, WhatsApp you, or trigger emergency alerts without ever seeing your private phone digits.",
    price: 499,
    features: [
      "Masked audio & video calls",
      "WhatsApp & SMS alerts",
      "Your number stays private",
      "Emergency contact",
      "Vehicle docs behind OTP",
      "Waterproof · lifetime free"
    ],
    image: "https://i.ibb.co/7dKMmXRw/image.png",
    gallery: [
      "https://i.ibb.co/7dKMmXRw/image.png"
    ],
    isActive: true,
    category: "Automotive"
  },
  {
    id: "2-ngf132-bike-tags",
    name: "2 NGF132 Bike Tags, (1 For Bike, 1 For Helmet). Get Help in emergency and Wrong Parking",
    rating: 4.4,
    shortDescription: "Get updates about your parked vehicle on your phone, WhatsApp and Masked call.",
    detailedDescription: "Get updates about your parked vehicle on your phone, WhatsApp and Masked call. Two specialized tags designed specifically for two-wheelers: one heavy-duty curved tag for your motorcycle or scooter, and one compact tag for the rider's helmet. Provides instant wrong-parking alerts, accident SOS support with emergency contacts, and blood group info.",
    price: 499,
    features: [
      "1 Tag for Bike body + 1 Tag for Rider Helmet",
      "Masked Calling & Instant WhatsApp notification",
      "Emergency SOS contact & Blood Group display",
      "Heavy-duty weatherproof curved adhesive",
      "Lifetime free cloud platform, zero recharges"
    ],
    image: "https://i.ibb.co/6RC8P8gf/image.png",
    gallery: [
      "https://i.ibb.co/6RC8P8gf/image.png"
    ],
    isActive: true,
    category: "Two-Wheeler"
  },
  {
    id: "car-bike-sampark-tag",
    name: "(Pack of 1) Car sampark tag, Let people call you for any issues with your parked car.",
    rating: 4.4,
    shortDescription: "We park our vehicles every day in public places, BUT have we ever thought if the parked vehicle is creating any issues and if it does how someone can reach us?",
    detailedDescription: "We park our vehicles every day in public places, BUT have we ever thought if the parked vehicle is creating any issues and if it does how someone can reach us? The single-pack Sampark car tag is perfect for individual vehicle owners. High-contrast QR tag mounts cleanly on your windshield. Protects your personal privacy while allowing security guards, traffic marshals, and fellow drivers to contact you instantly.",
    price: 399,
    originalPrice: 499,
    features: [
      "Masked Calling: Callers never see your phone number",
      "Instant WhatsApp & SMS alerts when parked wrongly",
      "Emergency contact & digital vehicle document locker",
      "Zero app required for bystanders scanning the tag",
      "3-Year outdoor weatherproof & sun-fade warranty",
      "Free pan-India delivery & Cash on Delivery (COD)"
    ],
    image: "https://i.ibb.co/ZpchMWHp/image.png",
    gallery: [
      "https://i.ibb.co/ZpchMWHp/image.png",
      "https://i.ibb.co/7dKMmXRw/image.png"
    ],
    isActive: true,
    category: "Automotive"
  }
];

// Contextual WhatsApp link generator
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${BUSINESS_CONFIG.whatsappRaw}?text=${encodeURIComponent(message)}`;
}

export function getProductEnquiryUrl(productName: string): string {
  return getWhatsAppUrl(`Hello, I want to know more about ${productName}.`);
}

export function getProductOrderWhatsAppUrl(productName: string, price: number): string {
  return getWhatsAppUrl(`Hello, I would like to order "${productName}" (₹${price}). Please guide me with booking.`);
}

export function getGeneralEnquiryUrl(): string {
  return getWhatsAppUrl("Hello, I would like to know more about your products and services.");
}

export function getAdminOrderNotificationText(order: {
  id: string;
  customerName: string;
  mobile: string;
  whatsapp: string;
  productName: string;
  quantity: number;
  address: string;
  city: string;
  pincode: string;
  customerNote?: string;
  totalAmount: number;
}): string {
  return `*NEW ORDER RECEIVED*\n\n` +
    `*Order ID:* ${order.id}\n` +
    `*Customer:* ${order.customerName}\n` +
    `*Mobile:* ${order.mobile}\n` +
    `*WhatsApp:* ${order.whatsapp}\n` +
    `*Product:* ${order.productName}\n` +
    `*Quantity:* ${order.quantity}\n` +
    `*Total Value:* ₹${order.totalAmount}\n` +
    `*Address:* ${order.address}\n` +
    `*City:* ${order.city}\n` +
    `*Pincode:* ${order.pincode}\n` +
    (order.customerNote ? `*Note:* ${order.customerNote}\n` : '') +
    `\n_Submitted via Sampark Delhi Order Portal_`;
}
