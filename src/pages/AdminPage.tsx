import React, { useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  subscribeToOrders, 
  updateOrderStatusInFirestore,
  type User 
} from '../lib/firebase';
import { Order, OrderStatus } from '../types';
import { useRouter } from '../context/RouterContext';
import { 
  Lock, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Phone, 
  MessageCircle, 
  Package, 
  User as UserIcon, 
  MapPin, 
  LogOut, 
  SlidersHorizontal,
  X,
  ArrowLeft,
  ShieldCheck,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { navigate } = useRouter();

  // Firebase Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  
  // Login form states
  const [email, setEmail] = useState<string>('samparkme.delhi@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginMode, setLoginMode] = useState<'signin' | 'signup'>('signin');
  const [loginError, setLoginError] = useState<string>('');
  const [loginSubmitting, setLoginSubmitting] = useState<boolean>(false);

  // Orders and real-time synchronization
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [ordersError, setOrdersError] = useState<string>('');
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNoteInput, setStatusNoteInput] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [statusSuccessMessage, setStatusSuccessMessage] = useState<string>('');

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to real-time Firestore orders when authenticated
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    setOrdersError('');

    const unsubscribeOrders = subscribeToOrders(
      (firestoreOrders) => {
        setOrders(firestoreOrders as Order[]);
        setOrdersLoading(false);
      },
      (error) => {
        console.error("Firestore orders subscription error:", error);
        setOrdersError(
          error.message.includes("permission-denied")
            ? "Access Denied: Please make sure your Firebase user is authorized and Firestore Security Rules allow read access."
            : error.message
        );
        setOrdersLoading(false);
      }
    );

    return () => unsubscribeOrders();
  }, [currentUser]);

  // Handle Firebase Sign In / Sign Up
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);

    try {
      if (loginMode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err: any) {
      console.error("Firebase auth error:", err);
      let friendlyMsg = err.message || "Failed to log in.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        friendlyMsg = "Invalid email or password. If you haven't created this user yet in Firebase Console, switch to 'Create Admin Account'.";
      } else if (err.code === 'auth/user-not-found') {
        friendlyMsg = "No Firebase user found with this email. Switch to 'Create Admin Account' or add it in Firebase Console.";
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMsg = "This email already exists in Firebase Auth. Switch to 'Log In'.";
      } else if (err.code === 'auth/weak-password') {
        friendlyMsg = "Password should be at least 6 characters long.";
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyMsg = "Email/Password sign-in is not enabled in Firebase Console. Go to Firebase Console > Authentication > Sign-in method and enable 'Email/Password'.";
      }
      setLoginError(friendlyMsg);
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Handle Order Status Update in Firestore
  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    setStatusSuccessMessage('');

    try {
      await updateOrderStatusInFirestore(
        selectedOrder.id,
        newStatus,
        statusNoteInput.trim() || undefined,
        selectedOrder.statusHistory || []
      );

      setStatusSuccessMessage(`Order status updated to ${newStatus}`);
      setStatusNoteInput('');
      
      // Update local modal view state
      setSelectedOrder((prev) => {
        if (!prev) return null;
        const newHist = [
          ...(prev.statusHistory || []),
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: statusNoteInput.trim() || `Status updated to ${newStatus}`
          }
        ];
        return {
          ...prev,
          status: newStatus,
          statusNotes: statusNoteInput.trim() || prev.statusNotes,
          statusHistory: newHist
        };
      });

      setTimeout(() => setStatusSuccessMessage(''), 4000);
    } catch (err: any) {
      alert("Failed to update status in Firestore: " + (err.message || "Unknown error"));
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filter and search orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const idMatch = (order.id || '').toLowerCase().includes(q);
    const nameMatch = (order.customerName || '').toLowerCase().includes(q);
    const phoneMatch = (order.mobile || '').includes(q) || (order.whatsapp || '').includes(q);
    const cityMatch = (order.city || '').toLowerCase().includes(q);
    return idMatch || nameMatch || phoneMatch || cityMatch;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    accepted: orders.filter((o) => o.status === 'ACCEPTED').length,
    rejected: orders.filter((o) => o.status === 'REJECTED').length,
    completed: orders.filter((o) => o.status === 'COMPLETED').length,
    totalRevenue: orders
      .filter((o) => o.status === 'ACCEPTED' || o.status === 'COMPLETED')
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
  };

  // Helper for status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>PENDING</span>
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
            <CheckCircle className="w-3 h-3 text-blue-700" />
            <span>ACCEPTED</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-700" />
            <span>DELIVERED</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-700" />
            <span>CANCELLED</span>
          </span>
        );
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  // Loading Screen while Firebase Auth initializes
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#FFE600] animate-spin" />
          <p className="text-sm font-semibold tracking-wide">Connecting to Firebase Security...</p>
        </div>
      </div>
    );
  }

  // Not Logged In: Render Secure Admin Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950 text-white selection:bg-[#FFE600] selection:text-black">
        <div className="bg-neutral-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-neutral-800">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE600] flex items-center justify-center text-black font-black text-2xl mx-auto mb-3 shadow-lg shadow-yellow-500/20">
              <Lock className="w-7 h-7 text-black" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Sampark Admin Portal</h2>
            <p className="text-xs text-neutral-400 mt-1">Firebase Cloud Firestore Orders Management</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 text-[11px] font-mono text-[#FFE600] mt-3 border border-neutral-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Project: samparkmedelhi-b812e</span>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Firebase Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="samparkme.delhi@gmail.com"
                className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  Firebase Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-[#FFE600]" />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-transparent"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-3 bg-[#FFE600] hover:bg-yellow-400 text-neutral-950 font-extrabold rounded-xl text-sm transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Authenticating with Firebase...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-black" />
                    <span>{loginMode === 'signup' ? 'Create Admin User' : 'Sign In to Admin Portal'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs text-neutral-400">
              <button
                type="button"
                onClick={() => {
                  setLoginMode(loginMode === 'signin' ? 'signup' : 'signin');
                  setLoginError('');
                }}
                className="hover:text-[#FFE600] transition-colors cursor-pointer"
              >
                {loginMode === 'signin' ? "First time? Create Admin Account →" : "← Already have an account? Sign In"}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Website</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard View
  return (
    <div className="min-h-screen bg-[#0f1115] text-neutral-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-[#FFE600] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header Bar */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE600] flex items-center justify-center font-black text-black text-xl shadow-md shadow-yellow-500/10">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">Sampark Order Dispatch</h1>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Firestore Live Sync</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Logged in as: <span className="font-semibold text-neutral-200">{currentUser.email}</span> · Firebase Project: <code className="font-mono text-[11px] text-[#FFE600]">samparkmedelhi-b812e</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-red-950/80 border border-red-900 text-red-200 hover:bg-red-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Sign Out of Firebase"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div 
            onClick={() => setStatusFilter('ALL')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'ALL' 
                ? 'bg-[#FFE600] text-neutral-950 border-[#FFE600] shadow-md shadow-yellow-500/10' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <span className="text-xs font-bold block opacity-80">Total Orders</span>
            <span className="text-2xl font-black mt-1 block">{stats.total}</span>
          </div>

          <div 
            onClick={() => setStatusFilter('PENDING')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'PENDING' 
                ? 'bg-amber-500 text-black border-amber-500 shadow-md' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <span className="text-xs font-bold block opacity-80">Pending Action</span>
            <span className="text-2xl font-black mt-1 block text-amber-400 group-hover:text-amber-300">{stats.pending}</span>
          </div>

          <div 
            onClick={() => setStatusFilter('ACCEPTED')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'ACCEPTED' 
                ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <span className="text-xs font-bold block opacity-80">Accepted / Transit</span>
            <span className="text-2xl font-black mt-1 block text-blue-400">{stats.accepted}</span>
          </div>

          <div 
            onClick={() => setStatusFilter('COMPLETED')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'COMPLETED' 
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <span className="text-xs font-bold block opacity-80">Delivered</span>
            <span className="text-2xl font-black mt-1 block text-emerald-400">{stats.completed}</span>
          </div>

          <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-200 col-span-2 sm:col-span-1">
            <span className="text-xs font-bold block text-neutral-400">Total COD Volume</span>
            <span className="text-2xl font-black mt-1 block text-[#FFE600]">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Orders Error banner */}
        {ordersError && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <div>
              <p className="font-bold">Firestore Error</p>
              <p className="text-xs text-red-300 mt-0.5">{ordersError}</p>
            </div>
          </div>
        )}

        {/* Main Orders Table & Controls */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          
          {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Customer Name, or Phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-transparent"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#FFE600] text-black font-extrabold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Content */}
          {ordersLoading ? (
            <div className="py-16 text-center text-neutral-400 space-y-2">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#FFE600]" />
              <p className="text-sm font-semibold">Listening for real-time Firebase orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-neutral-500 space-y-2 border border-dashed border-neutral-800 rounded-2xl">
              <Package className="w-10 h-10 mx-auto text-neutral-600" />
              <p className="text-sm font-semibold text-neutral-300">No orders found</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'ALL' 
                  ? "No orders match your current filter or search criteria." 
                  : "When a customer places an order on the website, it will instantly appear here automatically in real time."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-neutral-800">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-800/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-700/60">
                  <tr>
                    <th className="py-3 px-4">Order ID &amp; Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Phone / WhatsApp</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Product &amp; Qty</th>
                    <th className="py-3 px-4">Total COD</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#FFE600] group-hover:underline">{order.id}</span>
                        <span className="block text-[10px] text-neutral-500 mt-0.5">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'N/A'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{order.customerName}</span>
                        {order.customerNote && (
                          <span className="text-[10px] text-neutral-400 italic truncate block max-w-[140px]">
                            "{order.customerNote}"
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-neutral-200">
                          <Phone className="w-3 h-3 text-neutral-500" />
                          <span>{order.mobile}</span>
                        </div>
                        {order.whatsapp && order.whatsapp !== order.mobile && (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-0.5">
                            <MessageCircle className="w-2.5 h-2.5" />
                            <span>WA: {order.whatsapp}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-white block font-medium">{order.city || 'Delhi'}</span>
                        <span className="text-[10px] text-neutral-500 block font-mono">{order.pincode}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-neutral-200 font-medium block truncate max-w-[180px]">
                          {order.productName}
                        </span>
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          Qty: {order.quantity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                        ₹{order.totalAmount}
                        <span className="block text-[9px] font-sans text-neutral-400 uppercase font-semibold">COD</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#FFE600] hover:text-black font-bold text-[11px] transition-colors cursor-pointer border border-neutral-700"
                        >
                          View &amp; Dispatch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* Complete Order Details & Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-neutral-900 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-neutral-700 max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white">Order Details</h3>
                  <code className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#FFE600] text-black">
                    {selectedOrder.id}
                  </code>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Placed on: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('en-IN') : 'N/A'}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success toast inside modal */}
            {statusSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">{statusSuccessMessage}</span>
              </div>
            )}

            {/* Quick Contact & Customer Details Card */}
            <div className="bg-neutral-800/70 border border-neutral-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Customer Name</span>
                  <h4 className="text-base font-extrabold text-white">{selectedOrder.customerName}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedOrder.mobile}`}
                    className="px-3 py-1.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>

                  <a
                    href={`https://wa.me/91${(selectedOrder.whatsapp || selectedOrder.mobile).replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.customerName)},%20this%20is%20Sampark%20Delhi%20regarding%20your%20Order%20${selectedOrder.id}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-700/50 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Contact Numbers:</span>
                  <span className="font-mono text-white font-bold">Mobile: {selectedOrder.mobile}</span>
                  {selectedOrder.whatsapp && (
                    <span className="font-mono text-emerald-400 block">WhatsApp: {selectedOrder.whatsapp}</span>
                  )}
                </div>

                <div>
                  <span className="text-neutral-400 block text-[11px]">Delivery Address:</span>
                  <p className="text-white font-medium leading-snug">
                    {selectedOrder.address}, {selectedOrder.city} - {selectedOrder.pincode}
                  </p>
                </div>
              </div>

              {selectedOrder.customerNote && (
                <div className="pt-2 border-t border-neutral-700/50 text-xs">
                  <span className="text-neutral-400 block text-[11px]">Customer Special Instructions:</span>
                  <p className="text-amber-300 italic mt-0.5">"{selectedOrder.customerNote}"</p>
                </div>
              )}
            </div>

            {/* Products & Payment Card */}
            <div className="bg-neutral-800/70 border border-neutral-700/60 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Order Items &amp; COD Amount</span>
              
              <div className="space-y-2">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-neutral-700/40 last:border-0">
                      <div>
                        <span className="font-bold text-white">{item.productName}</span>
                        <span className="text-neutral-400 block text-[11px]">₹{item.price} × {item.quantity}</span>
                      </div>
                      <span className="font-mono font-bold text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{selectedOrder.productName}</span>
                      <span className="text-neutral-400 block text-[11px]">Unit Price: ₹{selectedOrder.productPrice} × {selectedOrder.quantity}</span>
                    </div>
                    <span className="font-mono font-bold text-white">₹{selectedOrder.totalAmount}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Payment Mode</span>
                  <span className="text-xs font-bold text-emerald-400">Cash on Delivery (COD)</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Total Payable</span>
                  <span className="text-xl font-black text-[#FFE600] font-mono">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Update Order Status in Firestore */}
            <div className="bg-neutral-800/70 border border-neutral-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Update Order Status</span>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {(['PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    disabled={updatingStatus || selectedOrder.status === st}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedOrder.status === st
                        ? 'bg-white text-black ring-2 ring-[#FFE600]'
                        : 'bg-neutral-700 hover:bg-neutral-600 text-white'
                    }`}
                  >
                    {st === 'COMPLETED' ? 'DELIVERED' : st === 'REJECTED' ? 'CANCEL' : st}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Optional Status / Dispatch Note:
                </label>
                <input
                  type="text"
                  value={statusNoteInput}
                  onChange={(e) => setStatusNoteInput(e.target.value)}
                  placeholder="e.g. Courier dispatched via Delhivery Tracking #12345"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#FFE600]"
                />
              </div>
            </div>

            {/* Status Audit History */}
            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Status History Audit</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedOrder.statusHistory.map((hist, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-neutral-800/50 border border-neutral-800 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">{hist.status}</span>
                        {hist.note && <span className="text-neutral-400 text-[11px] block">{hist.note}</span>}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(hist.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
