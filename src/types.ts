export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export interface Product {
  id: string;
  name: string;
  badge?: string;
  rating?: number;
  shortDescription: string;
  detailedDescription: string;
  price: number;
  originalPrice?: number;
  features: string[];
  image: string;
  gallery?: string[];
  isActive: boolean;
  category?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string; // e.g. SMK-20260916-001
  customerName: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  pincode: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalAmount: number;
  items?: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  customerNote?: string;
  status: OrderStatus;
  statusNotes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface OrderInput {
  customerName: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  pincode: string;
  productId?: string;
  quantity?: number;
  items?: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  customerNote?: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  completed: number;
}

export interface BusinessConfig {
  name: string;
  brandTitle: string;
  tagline: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  whatsappRaw: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  facebook: string;
  facebookUrl: string;
  address: string;
  addressDetails: string;
  googleMapsUrl: string;
  playStoreUrl: string;
  appStoreUrl: string;
  sharkTankNotice: string;
  stats: {
    activeTags: string;
    revenueGrowth: string;
    satisfaction: string;
  };
}
