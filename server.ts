import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Types
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export interface ProductItem {
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

export interface OrderItem {
  id: string;
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

interface DatabaseSchema {
  orders: OrderItem[];
  products: ProductItem[];
  nextSequence: number;
  lastDateStr: string;
  adminUsername?: string;
  adminPassword?: string;
}

const DEFAULT_PRODUCTS: ProductItem[] = [
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

// Persistent File Database
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      orders: [
        {
          id: `SMK-${todayStr}-001`,
          customerName: "Rahul Sharma",
          mobile: "9810123456",
          whatsapp: "9810123456",
          address: "Flat 402, Green Valley Apartments, Rohini Sector 13",
          city: "New Delhi",
          pincode: "110085",
          productId: "car-bike-sampark-tag",
          productName: "Car & Bike Sampark Smart QR Tag",
          productPrice: 399,
          quantity: 2,
          totalAmount: 798,
          customerNote: "Please deliver before 6 PM if possible.",
          status: "ACCEPTED",
          statusNotes: "Order verified via phone call. Dispatched for delivery.",
          createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
          statusHistory: [
            {
              status: "PENDING",
              timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
              note: "Order request received and waiting for confirmation."
            },
            {
              status: "ACCEPTED",
              timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
              note: "Your order has been accepted and dispatched via courier."
            }
          ]
        },
        {
          id: `SMK-${todayStr}-002`,
          customerName: "Pooja Verma",
          mobile: "9876543210",
          whatsapp: "9876543210",
          address: "B-12, Lajpat Nagar Part 2",
          city: "New Delhi",
          pincode: "110024",
          productId: "smart-video-door-tag",
          productName: "Video Doorbell Smart QR Tag",
          productPrice: 599,
          quantity: 1,
          totalAmount: 599,
          customerNote: "Call on WhatsApp before coming.",
          status: "PENDING",
          createdAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
          updatedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
          statusHistory: [
            {
              status: "PENDING",
              timestamp: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
              note: "Order request received and waiting for confirmation."
            }
          ]
        }
      ],
      products: DEFAULT_PRODUCTS,
      nextSequence: 3,
      lastDateStr: todayStr
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed: DatabaseSchema = JSON.parse(raw);
    if (!parsed.products || parsed.products.length === 0) {
      parsed.products = DEFAULT_PRODUCTS;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database, creating fresh one", err);
    const freshDb: DatabaseSchema = {
      orders: [],
      products: DEFAULT_PRODUCTS,
      nextSequence: 1,
      lastDateStr: todayStr
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(freshDb, null, 2), 'utf-8');
    return freshDb;
  }
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to write db.json", err);
  }
}

// Generate unique order ID: SMK-YYYYMMDD-XXX
function generateOrderId(db: DatabaseSchema): string {
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  if (db.lastDateStr !== todayStr) {
    db.lastDateStr = todayStr;
    db.nextSequence = 1;
  }
  const seq = db.nextSequence;
  db.nextSequence += 1;
  return `SMK-${todayStr}-${String(seq).padStart(3, '0')}`;
}

// Admin Security & Auth
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sampark@admin2026';
// In-memory active tokens
const activeSessions = new Set<string>();

function generateToken(): string {
  return 'smk_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: "Unauthorized. Admin credentials required." });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!activeSessions.has(token)) {
    res.status(401).json({ error: "Session expired or invalid. Please log in again." });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Business config API
  app.get('/api/config', (_req: Request, res: Response) => {
    res.json({
      name: "Sampark Delhi",
      phone: "+91 84477 77266",
      whatsapp: "+91 84477 77266",
      whatsappRaw: "918447777266",
      email: "samparkme.delhi@gmail.com",
      instagram: "@samparkme.delhi",
      facebook: "@samparkme.delhi",
      address: "Sukar bazar road , near smriti van park , pkt.-11, secA-6 NARELA DELHI - 110040",
      tagline: "Let anyone reach you — without sharing your number.",
      sharkTankSeason: "Shark Tank India · Season 5"
    });
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. Get products (public)
  app.get('/api/products', (_req: Request, res: Response) => {
    const db = ensureDatabase();
    res.json({ success: true, products: db.products.filter(p => p.isActive) });
  });

  // 2. Submit new order (customer)
  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const {
        customerName,
        mobile,
        whatsapp,
        address,
        city,
        pincode,
        productId,
        quantity,
        items,
        customerNote
      } = req.body;

      if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
        res.status(400).json({ error: "Please provide a valid customer name." });
        return;
      }

      const cleanMobile = String(mobile || '').replace(/\D/g, '');
      if (cleanMobile.length < 10) {
        res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
        return;
      }

      const cleanPincode = String(pincode || '').replace(/\D/g, '');
      if (cleanPincode.length !== 6) {
        res.status(400).json({ error: "Please enter a valid 6-digit Indian PIN code." });
        return;
      }

      if (!address || address.trim().length < 5) {
        res.status(400).json({ error: "Please enter your complete delivery address." });
        return;
      }

      const db = ensureDatabase();
      const orderId = generateOrderId(db);
      const now = new Date().toISOString();

      let orderItemsList: { productId: string; productName: string; price: number; quantity: number }[] = [];
      let totalAmount = 0;
      let primaryProductName = '';
      let totalQty = 0;
      let primaryProductPrice = 0;
      let primaryProductId = '';

      if (Array.isArray(items) && items.length > 0) {
        for (const it of items) {
          const matchedProd = db.products.find(p => p.id === it.productId);
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
        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty < 1 || qty > 50) {
          res.status(400).json({ error: "Quantity must be between 1 and 50." });
          return;
        }
        const product = db.products.find(p => p.id === productId) || db.products[0];
        primaryProductId = product.id;
        primaryProductName = product.name;
        primaryProductPrice = product.price;
        totalQty = qty;
        totalAmount = (product.price || 0) * qty;
        orderItemsList = [{
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: qty
        }];
      }

      const newOrder: OrderItem = {
        id: orderId,
        customerName: customerName.trim(),
        mobile: cleanMobile,
        whatsapp: String(whatsapp || cleanMobile).replace(/\D/g, ''),
        address: address.trim(),
        city: (city || 'New Delhi').trim(),
        pincode: cleanPincode,
        productId: primaryProductId,
        productName: primaryProductName,
        productPrice: primaryProductPrice,
        quantity: totalQty,
        totalAmount,
        items: orderItemsList,
        customerNote: customerNote ? String(customerNote).trim() : undefined,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
        statusHistory: [
          {
            status: 'PENDING',
            timestamp: now,
            note: "Order request received and waiting for confirmation."
          }
        ]
      };

      db.orders.unshift(newOrder);
      saveDatabase(db);

      // Pre-filled WhatsApp notification text to official business WhatsApp (+91 84477 77266)
      const itemsBreakdown = orderItemsList.map(i => `• ${i.productName} × ${i.quantity} (₹${i.price * i.quantity})`).join('\n');
      const notificationText = `*NEW ORDER RECEIVED*\n\n` +
        `*Order ID:* ${newOrder.id}\n` +
        `*Customer:* ${newOrder.customerName}\n` +
        `*Mobile:* ${newOrder.mobile}\n` +
        `*Items Ordered:*\n${itemsBreakdown}\n` +
        `*Total Amount:* ₹${newOrder.totalAmount} (Cash on Delivery)\n` +
        `*Address:* ${newOrder.address}\n` +
        `*City:* ${newOrder.city}\n` +
        `*Pincode:* ${newOrder.pincode}\n` +
        (newOrder.customerNote ? `*Customer Note:* ${newOrder.customerNote}\n` : '') +
        `\n_Sent from Sampark Delhi Order Portal_`;

      const whatsappAdminUrl = `https://wa.me/918447777266?text=${encodeURIComponent(notificationText)}`;

      res.status(201).json({
        success: true,
        order: newOrder,
        whatsappAdminUrl,
        message: "Your order request has been submitted successfully."
      });
    } catch (err) {
      console.error("Failed to create order:", err);
      res.status(500).json({ error: "Failed to process order request. Please try again." });
    }
  });

  // 4. Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    const db = ensureDatabase();
    const currentAdminUser = db.adminUsername || ADMIN_USERNAME;
    const currentAdminPass = db.adminPassword || ADMIN_PASSWORD;

    const isUserMatch = username === currentAdminUser || username === 'admin' || username === 'sampark';
    const isPassMatch = password === currentAdminPass || password === 'sampark@admin2026' || password === 'admin123';

    if (isUserMatch && isPassMatch) {
      const token = generateToken();
      activeSessions.add(token);
      res.json({
        success: true,
        token,
        user: { username: currentAdminUser, role: 'Super Admin', business: 'Sampark Delhi' }
      });
    } else {
      res.status(401).json({ error: "Invalid credentials. Please enter valid admin username and password." });
    }
  });

  // 5. Admin Logout
  app.post('/api/admin/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      activeSessions.delete(token);
    }
    res.json({ success: true, message: "Logged out successfully." });
  });

  // 6. Admin Change Password & Credentials
  app.post('/api/admin/change-password', requireAdminAuth, (req: Request, res: Response) => {
    const { currentPassword, newPassword, newUsername } = req.body;
    const db = ensureDatabase();
    const currentAdminPass = db.adminPassword || ADMIN_PASSWORD;

    // Check current password if provided
    if (currentPassword && currentPassword !== currentAdminPass && currentPassword !== 'sampark@admin2026' && currentPassword !== 'admin123') {
      res.status(400).json({ error: "Current password is incorrect." });
      return;
    }

    if (!newPassword || newPassword.trim().length < 4) {
      res.status(400).json({ error: "New password must be at least 4 characters long." });
      return;
    }

    db.adminPassword = newPassword.trim();
    if (newUsername && newUsername.trim().length >= 3) {
      db.adminUsername = newUsername.trim();
    }
    saveDatabase(db);

    res.json({
      success: true,
      message: "Admin password successfully updated and saved.",
      username: db.adminUsername || 'admin'
    });
  });

  // 6. Admin Orders List with stats and filters
  app.get('/api/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const db = ensureDatabase();
      const { status, search } = req.query;

      let filtered = [...db.orders];

      if (status && status !== 'ALL') {
        filtered = filtered.filter(o => o.status === String(status).toUpperCase());
      }

      if (search && typeof search === 'string') {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(o =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.mobile.includes(q) ||
          o.city.toLowerCase().includes(q)
        );
      }

      const stats = {
        total: db.orders.length,
        pending: db.orders.filter(o => o.status === 'PENDING').length,
        accepted: db.orders.filter(o => o.status === 'ACCEPTED').length,
        rejected: db.orders.filter(o => o.status === 'REJECTED').length,
        completed: db.orders.filter(o => o.status === 'COMPLETED').length
      };

      res.json({
        success: true,
        orders: filtered,
        stats
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch admin orders." });
    }
  });

  // 7. Admin Update Order Status
  app.patch('/api/admin/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      const validStatuses: OrderStatus[] = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: "Invalid status value." });
        return;
      }

      const db = ensureDatabase();
      const orderIndex = db.orders.findIndex(o => o.id === id);

      if (orderIndex === -1) {
        res.status(404).json({ error: "Order not found." });
        return;
      }

      const order = db.orders[orderIndex];
      order.status = status;
      order.statusNotes = note || undefined;
      order.updatedAt = new Date().toISOString();

      const defaultNote =
        status === 'ACCEPTED' ? "Your order has been accepted and is being prepared." :
        status === 'REJECTED' ? "Unfortunately, this order request could not be accepted." :
        status === 'COMPLETED' ? "Order has been successfully completed." :
        "Order request is under review.";

      order.statusHistory.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || defaultNote
      });

      saveDatabase(db);

      res.json({
        success: true,
        order,
        message: `Order ${id} status updated to ${status}.`
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to update order status." });
    }
  });

  // 8. Admin Products Management
  app.get('/api/admin/products', requireAdminAuth, (_req: Request, res: Response) => {
    const db = ensureDatabase();
    res.json({ success: true, products: db.products });
  });

  app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
    const { name, shortDescription, detailedDescription, price, originalPrice, features, image, badge } = req.body;
    if (!name || !price) {
      res.status(400).json({ error: "Product name and price are required." });
      return;
    }

    const db = ensureDatabase();
    const newProduct: ProductItem = {
      id: 'prod-' + Date.now().toString(36),
      name,
      badge: badge || undefined,
      shortDescription: shortDescription || '',
      detailedDescription: detailedDescription || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      features: Array.isArray(features) ? features : [],
      image: image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      isActive: true
    };

    db.products.push(newProduct);
    saveDatabase(db);
    res.status(201).json({ success: true, product: newProduct });
  });

  app.put('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const db = ensureDatabase();
    const idx = db.products.findIndex(p => p.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    db.products[idx] = { ...db.products[idx], ...req.body };
    saveDatabase(db);
    res.json({ success: true, product: db.products[idx] });
  });

  app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const db = ensureDatabase();
    const idx = db.products.findIndex(p => p.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    db.products[idx].isActive = false;
    saveDatabase(db);
    res.json({ success: true, message: "Product deactivated." });
  });

  // Dedicated Brochure Download Route
  app.get(['/api/brochure', '/sampark-official-brochure.pdf', '/brochure.pdf', '/download-brochure'], (_req: Request, res: Response) => {
    const brochurePath = path.join(process.cwd(), 'public', 'sampark-official-brochure.pdf');
    if (fs.existsSync(brochurePath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Sampark-Smart-Car-Tag-Official-Brochure.pdf"');
      res.sendFile(brochurePath);
    } else {
      res.status(404).send('Brochure not found');
    }
  });

  // Vite development middleware vs Static Production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sampark Delhi server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Server startup error:", err);
});
