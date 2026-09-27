import React, { useEffect, useState } from 'react';
import { StoreService, storeEvents } from '../../services/storeService';
import type { AdminOrder, OrderStatus } from '../../types/admin';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Package,
  Phone,
  MapPin,
  CreditCard,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

const STATUS_OPTIONS: OrderStatus[] = ['جديد', 'قيد التجهيز', 'تم الشحن', 'تم التسليم', 'ملغي'];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await StoreService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    return storeEvents.subscribe(() => {
      loadOrders();
    });
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await StoreService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      showToast(`تم تغيير حالة الطلب ${orderId} إلى "${newStatus}"`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'جديد':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'قيد التجهيز':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'تم الشحن':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'تم التسليم':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'ملغي':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'جديد':
        return <Clock className="w-3.5 h-3.5" />;
      case 'قيد التجهيز':
        return <Package className="w-3.5 h-3.5" />;
      case 'تم الشحن':
        return <Truck className="w-3.5 h-3.5" />;
      case 'تم التسليم':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'ملغي':
        return <XCircle className="w-3.5 h-3.5" />;
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'all' && o.status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchCity = o.customerCity.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#16291e] border border-emerald-500/40 text-emerald-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-[#c5a059]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-amiri text-white">إدارة طلبات المتجر</h2>
          <p className="text-xs text-white/50">
            متابعة طلبات العميلات، تحديث حالات الشحن والتسليم، وتفاصيل الفواتير
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors self-start"
          title="تحديث قائمة الطلبات"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-[#111815] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الطلب، اسم العميلة، المدينة، أو رقم الجوال..."
              className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 pr-10 text-xs text-white placeholder-white/40 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#16201b] border border-white/15 focus:border-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-all"
            >
              <option value="all">جميع الحالات</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick status pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs">
          <span className="text-white/40 text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>تصفية سريعة:</span>
          </span>
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1 rounded-lg text-xs transition-colors ${
              selectedStatus === 'all'
                ? 'bg-[#c5a059] text-[#0a0f0d] font-bold'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            الكل ({orders.length})
          </button>
          {STATUS_OPTIONS.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  selectedStatus === st
                    ? 'bg-[#c5a059] text-[#0a0f0d] font-bold'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#111815] border border-white/10 rounded-2xl p-12 text-center text-white/50 text-xs">
          لا توجد طلبات تطابق معايير البحث
        </div>
      ) : (
        <div className="bg-[#111815] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#16201b] border-b border-white/10 text-white/60">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">رقم الطلب</th>
                  <th className="py-3.5 px-4 font-semibold">العميلة</th>
                  <th className="py-3.5 px-4 font-semibold">الجوال والمدينة</th>
                  <th className="py-3.5 px-4 font-semibold">عدد القطع</th>
                  <th className="py-3.5 px-4 font-semibold">الإجمالي</th>
                  <th className="py-3.5 px-4 font-semibold">طريقة الدفع</th>
                  <th className="py-3.5 px-4 font-semibold">الحالة</th>
                  <th className="py-3.5 px-4 font-semibold">التاريخ</th>
                  <th className="py-3.5 px-4 font-semibold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#c5a059]">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-white/70">
                      <div>{order.customerCity}</div>
                      <div className="text-[10px] text-white/40 font-mono mt-0.5" dir="ltr">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-white/70">
                      {order.items.reduce((s, it) => s + it.quantity, 0)} قطع
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-white">
                      {order.total.toLocaleString()} ر.س
                    </td>
                    <td className="py-3.5 px-4 text-white/60 text-[11px]">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st} className="bg-[#111815] text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-white/40 text-[11px] font-sans">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[11px] font-medium flex items-center gap-1.5 mx-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>تفاصيل</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151c18] border border-white/15 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#c5a059] font-mono font-bold">{selectedOrder.id}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${getStatusBadge(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span>{selectedOrder.status}</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-amiri mt-1">تفاصيل طلب العميلة</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white/40 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 border border-white/10 rounded-xl p-4 text-xs">
              <div className="space-y-1.5">
                <p className="text-white/50">بيانات العميلة:</p>
                <p className="font-bold text-white text-sm">{selectedOrder.customerName}</p>
                <p className="flex items-center gap-2 text-white/70 font-mono" dir="ltr">
                  <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{selectedOrder.customerPhone}</span>
                </p>
                {selectedOrder.customerEmail && (
                  <p className="text-white/60">{selectedOrder.customerEmail}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-white/50">عنوان التوصيل:</p>
                <p className="flex items-center gap-1.5 font-bold text-white">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{selectedOrder.customerCity}</span>
                </p>
                <p className="text-white/70 leading-relaxed">{selectedOrder.customerAddress}</p>
                <p className="text-white/50 flex items-center gap-1.5 pt-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>طريقة الدفع: {selectedOrder.paymentMethod}</span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white border-b border-white/10 pb-2">
                المنتجات المطلوبة ({selectedOrder.items.length})
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {it.image && (
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-12 h-14 rounded-lg object-cover bg-black border border-white/10"
                        />
                      )}
                      <div>
                        <p className="font-bold text-white">{it.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-white/50 mt-1">
                          {it.size && <span>المقاس: <strong className="text-white font-sans">{it.size}</strong></span>}
                          {it.color && <span>اللون: <strong className="text-white">{it.color}</strong></span>}
                          <span>الكمية: <strong className="text-white font-sans">{it.quantity}</strong></span>
                        </div>
                      </div>
                    </div>
                    <div className="font-sans font-bold text-white text-sm">
                      {(it.price * it.quantity).toLocaleString()} ر.س
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-[#111815] border border-white/10 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-white/60">
                <span>المجموع الفرعي:</span>
                <span className="font-sans">{selectedOrder.subtotal.toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>رسوم الشحن والتوصيل:</span>
                <span className="font-sans">{selectedOrder.shipping === 0 ? 'مجاني' : `${selectedOrder.shipping} ر.س`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>المبلغ الإجمالي المستحق:</span>
                <span className="font-sans text-[#c5a059] text-base">{selectedOrder.total.toLocaleString()} ر.س</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">تغيير الحالة:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="bg-[#16201b] border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
