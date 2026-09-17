import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Product, OrderStats } from '../types';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { 
  Lock, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Phone, 
  MessageCircle, 
  Package, 
  User, 
  MapPin, 
  DollarSign, 
  LogOut, 
  SlidersHorizontal,
  X,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  EyeOff,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

interface AdminPortalProps {
  onBackToHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToHome }) => {
  // Authentication states
  const [token, setToken] = useState<string>(() => localStorage.getItem('smk_admin_token') || '');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Change Password states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeMsg, setPasswordChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tab: 'orders' | 'products'
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Orders data
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({ total: 0, pending: 0, accepted: 0, rejected: 0, completed: 0 });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNoteInput, setStatusNoteInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Products data
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }

      setToken(data.token);
      localStorage.setItem('smk_admin_token', data.token);
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials. Please check your username and password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // ignore
    }
    setToken('');
    localStorage.removeItem('smk_admin_token');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMsg(null);

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPasswordInput.length < 4) {
      setPasswordChangeMsg({ type: 'error', text: 'New password must be at least 4 characters long.' });
      return;
    }

    setPasswordChangeLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput,
          newUsername: newUsernameInput.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordChangeMsg({ type: 'success', text: 'Password successfully updated! It is saved permanently.' });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      if (data.username) {
        setUsername(data.username);
      }
    } catch (err: any) {
      setPasswordChangeMsg({ type: 'error', text: err.message || 'Error updating password.' });
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'ALL') queryParams.append('status', statusFilter);
      if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/orders?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (data.success) {
        setOrders(data.orders);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    if (!token) return;
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchProducts();
    }
  }, [token, statusFilter]);

  // Update order status
  const handleUpdateStatus = async (orderId: string, status: OrderStatus, customNote?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, note: customNote })
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setActionLoading(false);
    }
  };

  // If not logged in, render login screen
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#fbfbfa]">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-neutral-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#f5c518] flex items-center justify-center text-black font-black text-xl mx-auto mb-3 shadow">
              <Lock className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Admin Portal</h2>
            <p className="text-xs text-neutral-500 mt-1">Sampark Delhi Order Management &amp; Dispatch</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f5c518]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 cursor-pointer font-medium"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f5c518]"
                />
              </div>
              <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-700">Username:</span>
                  <code className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-mono text-neutral-900 font-bold">admin</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-700">Default Password:</span>
                  <code className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-mono text-neutral-900 font-bold select-all">sampark@admin2026</code>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#f5c518] hover:bg-[#eab90d] text-neutral-950 font-extrabold rounded-xl text-sm transition-all shadow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Access Admin Portal</span>
              )}
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-black flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Website</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f5c518] flex items-center justify-center font-black text-black">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Admin Portal</h1>
                <span className="text-[10px] uppercase font-bold bg-neutral-900 text-[#f5c518] px-2 py-0.5 rounded">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Official Business Number: {BUSINESS_CONFIG.phone} · {BUSINESS_CONFIG.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Orders ({stats.total})
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Manage Products ({products.length})
            </button>

            <button
              onClick={() => {
                setShowPasswordModal(true);
                setPasswordChangeMsg(null);
                setCurrentPasswordInput('');
                setNewPasswordInput('');
                setConfirmPasswordInput('');
                setNewUsernameInput('');
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-300 bg-white text-neutral-800 hover:border-black transition-colors cursor-pointer"
              title="Change Admin Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-neutral-700" />
              <span>Change Password</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-neutral-300 text-neutral-700 hover:border-black transition-colors"
            >
              View Site
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-neutral-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div 
                onClick={() => setStatusFilter('ALL')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'ALL' ? 'bg-neutral-900 text-white border-neutral-900 shadow' : 'bg-white border-neutral-200 text-neutral-900 hover:border-neutral-400'
                }`}
              >
                <span className="text-xs opacity-75 font-semibold block">Total Orders</span>
                <span className="text-2xl font-black mt-1 block">{stats.total}</span>
              </div>

              <div 
                onClick={() => setStatusFilter('PENDING')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'PENDING' ? 'bg-amber-500 text-white border-amber-600 shadow' : 'bg-white border-amber-200 text-amber-900 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Pending</span>
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-2xl font-black mt-1 block">{stats.pending}</span>
              </div>

              <div 
                onClick={() => setStatusFilter('ACCEPTED')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'ACCEPTED' ? 'bg-emerald-600 text-white border-emerald-700 shadow' : 'bg-white border-emerald-200 text-emerald-900 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Accepted</span>
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-2xl font-black mt-1 block">{stats.accepted}</span>
              </div>

              <div 
                onClick={() => setStatusFilter('COMPLETED')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'COMPLETED' ? 'bg-blue-600 text-white border-blue-700 shadow' : 'bg-white border-blue-200 text-blue-900 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Completed</span>
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-2xl font-black mt-1 block">{stats.completed}</span>
              </div>

              <div 
                onClick={() => setStatusFilter('REJECTED')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'REJECTED' ? 'bg-rose-600 text-white border-rose-700 shadow' : 'bg-white border-rose-200 text-rose-900 hover:border-rose-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Rejected</span>
                  <XCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-2xl font-black mt-1 block">{stats.rejected}</span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Name, Mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f5c518]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={fetchOrders}
                  className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold hover:bg-neutral-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Orders Table & Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
              {loadingOrders ? (
                <div className="p-12 text-center text-neutral-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Loading orders database...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center text-neutral-500">
                  <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="font-bold text-sm text-neutral-800">No orders found</p>
                  <p className="text-xs text-neutral-400 mt-1">Try changing the status filter or search query.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Product &amp; Qty</th>
                        <th className="py-3 px-4">City / Pincode</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-black text-neutral-900 whitespace-nowrap">
                            {order.id}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-neutral-800 whitespace-nowrap">
                            {order.customerName}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-neutral-700">{order.mobile}</span>
                              <a
                                href={`https://wa.me/91${order.whatsapp}?text=Hello%20${encodeURIComponent(order.customerName)}%2C%20regarding%20your%20Sampark%20order%20${order.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-emerald-50"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-700">
                            <span className="font-semibold">{order.productName}</span>
                            <span className="text-neutral-400 ml-1">× {order.quantity}</span>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600">
                            {order.city} - {order.pincode}
                          </td>
                          <td className="py-3.5 px-4 font-black text-neutral-900 whitespace-nowrap">
                            {order.totalAmount === 0 ? 'Free' : `₹${order.totalAmount}`}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              order.status === 'PENDING' ? 'bg-amber-100 text-amber-900' :
                              order.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-900' :
                              order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-900' :
                              'bg-rose-100 text-rose-900'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Details
                            </button>

                            {order.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'REJECTED')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {order.status === 'ACCEPTED' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                                disabled={actionLoading}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Product Catalog Management</h2>
                <p className="text-xs text-neutral-500">Edit prices, descriptions, and toggle active products</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-neutral-200 space-y-3 bg-[#fbfbfa]">
                  <div className="relative h-40 rounded-xl overflow-hidden bg-neutral-200">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-neutral-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {p.isActive ? 'Active' : 'Disabled'}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-neutral-900">{p.name}</h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{p.shortDescription}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-black text-neutral-950">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs line-through text-neutral-400">₹{p.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">ID: {p.id}</span>
                    <button
                      onClick={async () => {
                        const newPrice = prompt(`Enter new price for ${p.name}:`, String(p.price));
                        if (newPrice !== null && !isNaN(Number(newPrice))) {
                          await fetch(`/api/admin/products/${p.id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({ price: Number(newPrice) })
                          });
                          fetchProducts();
                        }
                      }}
                      className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Price</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Complete Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto space-y-6 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">Order Reference</span>
                <h3 className="text-xl font-black font-mono text-neutral-900">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick action buttons inside modal */}
            <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-700">Change Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-neutral-200 text-neutral-800">
                  Current: {selectedOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'ACCEPTED', statusNoteInput)}
                  className="py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                >
                  Accept Order
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'COMPLETED', statusNoteInput)}
                  className="py-2 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'REJECTED', statusNoteInput)}
                  className="py-2 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                >
                  Reject Order
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Optional custom status note (seen by customer on tracking)..."
                  value={statusNoteInput}
                  onChange={(e) => setStatusNoteInput(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white rounded-lg border border-neutral-300 text-xs"
                />
              </div>
            </div>

            {/* Customer information */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-xs text-neutral-400">Customer Details</h4>
              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Name:</span>
                  <span className="font-bold text-neutral-900">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Mobile:</span>
                  <span className="font-bold text-neutral-900">{selectedOrder.mobile}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">WhatsApp:</span>
                  <a
                    href={`https://wa.me/91${selectedOrder.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 underline"
                  >
                    +91 {selectedOrder.whatsapp}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Date Booked:</span>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-xs text-neutral-400">Delivery Address</h4>
              <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
                <p className="font-semibold text-neutral-900">{selectedOrder.address}</p>
                <p className="text-neutral-600">{selectedOrder.city} - {selectedOrder.pincode}</p>
                {selectedOrder.customerNote && (
                  <p className="text-amber-800 bg-amber-50 p-2 rounded text-xs mt-2 border border-amber-200">
                    <strong>Customer Note:</strong> {selectedOrder.customerNote}
                  </p>
                )}
              </div>
            </div>

            {/* Product & Payment */}
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-xs text-neutral-400">Order Items &amp; Amount</h4>
              <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">{selectedOrder.productName}</p>
                  <p className="text-xs text-neutral-500">Unit: ₹{selectedOrder.productPrice} × {selectedOrder.quantity}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-neutral-950">₹{selectedOrder.totalAmount}</span>
                  <span className="block text-[10px] text-emerald-700 font-bold">Collect on Delivery (COD)</span>
                </div>
              </div>
            </div>

            {/* Status History */}
            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-xs text-neutral-400">Status History</h4>
                <div className="space-y-1.5">
                  {selectedOrder.statusHistory.map((hist, idx) => (
                    <div key={idx} className="text-xs p-2 rounded bg-neutral-50 flex items-center justify-between">
                      <span className="font-bold">{hist.status}</span>
                      <span className="text-neutral-400 text-[11px]">{new Date(hist.timestamp).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#f5c518] flex items-center justify-center text-black font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-neutral-900">Change Admin Password</h3>
                  <p className="text-xs text-neutral-500">Update your secret credentials securely</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordChangeMsg && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                  passwordChangeMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {passwordChangeMsg.type === 'success' ? (
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{passwordChangeMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="Enter current password (e.g. sampark@admin2026)"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f5c518]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-700">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showNewPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Enter at least 4 characters"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f5c518]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f5c518]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Admin Username (Optional)
                </label>
                <input
                  type="text"
                  value={newUsernameInput}
                  onChange={(e) => setNewUsernameInput(e.target.value)}
                  placeholder="Keep current (admin)"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f5c518]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordChangeLoading}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {passwordChangeLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FFE600]" />
                      <span>Save New Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
