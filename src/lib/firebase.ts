import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";

// Exact Firebase project configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyCoH15h52SWra0_UK7FA8m2Fg_stU-Zt9U",
  authDomain: "samparkmedelhi-b812e.firebaseapp.com",
  projectId: "samparkmedelhi-b812e",
  storageBucket: "samparkmedelhi-b812e.firebasestorage.app",
  messagingSenderId: "594244991494",
  appId: "1:594244991494:web:eeb46b84b387570ef5a187"
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// Save customer order to Firestore collection "orders"
export async function saveOrderToFirestore(order: any): Promise<void> {
  if (!order || !order.id) {
    throw new Error("Invalid order data: Missing order ID");
  }

  const orderDocRef = doc(db, "orders", order.id);

  const firestoreData = {
    id: order.id,
    customerName: order.customerName || "",
    mobile: order.mobile || "",
    whatsapp: order.whatsapp || order.mobile || "",
    address: order.address || "",
    city: order.city || "Delhi",
    pincode: order.pincode || "",
    productId: order.productId || "",
    productName: order.productName || "",
    productPrice: Number(order.productPrice) || 0,
    quantity: Number(order.quantity) || 1,
    totalAmount: Number(order.totalAmount) || 0,
    items: order.items || [
      {
        productId: order.productId || "",
        productName: order.productName || "",
        price: Number(order.productPrice) || 0,
        quantity: Number(order.quantity) || 1
      }
    ],
    customerNote: order.customerNote || "",
    status: order.status || "PENDING",
    paymentMethod: "Cash on Delivery (COD)",
    paymentStatus: "Pending on Delivery",
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    firestoreSavedAt: serverTimestamp(),
    statusHistory: order.statusHistory || [
      {
        status: order.status || "PENDING",
        timestamp: new Date().toISOString(),
        note: "Order placed on Sampark Delhi"
      }
    ]
  };

  await setDoc(orderDocRef, firestoreData, { merge: true });
}

// Update order status in Firestore
export async function updateOrderStatusInFirestore(
  orderId: string, 
  newStatus: string, 
  note?: string,
  existingHistory: any[] = []
): Promise<void> {
  const orderDocRef = doc(db, "orders", orderId);
  const newHistoryEntry = {
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status changed to ${newStatus}`
  };

  await updateDoc(orderDocRef, {
    status: newStatus,
    updatedAt: new Date().toISOString(),
    statusNotes: note || `Status changed to ${newStatus}`,
    statusHistory: [...existingHistory, newHistoryEntry]
  });
}

// Subscribe to real-time order updates for the Admin page
export function subscribeToOrders(
  onOrdersChange: (orders: any[]) => void,
  onError: (error: Error) => void
) {
  const ordersCollection = collection(db, "orders");
  // Try ordered by createdAt, fallback to unordered if index is pending
  const q = query(ordersCollection, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const ordersList: any[] = [];
      snapshot.forEach((docSnap) => {
        ordersList.push({ ...docSnap.data(), firestoreId: docSnap.id });
      });
      onOrdersChange(ordersList);
    },
    (err) => {
      // If index error or ordering error, fallback to simple collection query
      console.warn("Retrying query without orderBy index:", err.message);
      const fallbackUnordered = collection(db, "orders");
      onSnapshot(
        fallbackUnordered,
        (snapshot) => {
          const ordersList: any[] = [];
          snapshot.forEach((docSnap) => {
            ordersList.push({ ...docSnap.data(), firestoreId: docSnap.id });
          });
          // Sort client side
          ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          onOrdersChange(ordersList);
        },
        (fallbackErr) => {
          onError(fallbackErr);
        }
      );
    }
  );
}

// Export Auth helpers
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  type User 
};
