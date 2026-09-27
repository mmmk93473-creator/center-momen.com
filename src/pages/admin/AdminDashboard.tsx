import React, { useEffect, useState } from 'react';
import { StoreService, storeEvents } from '../../services/storeService';
import type { AdminMetrics, AdminOrder } from '../../types/admin';
import type { Product } from '../../types/product';
import type { AdminTab } from '../../components/admin/AdminLayout';
import {
  ShoppingBag,
  PackageCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: AdminTab, params?: { productId?: string }) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, orders, products] = await Promise.all([
        StoreService.getMetrics(),
        StoreService.getOrders(),
        StoreService.getProducts(),
      ]);

      setMetrics(m);
      setRecentOrders(orders.slice(0, 5));
      setLowStockProducts(products.filter(p => p.stock <= 3 && p.status === 'published').slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = storeEvents.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'جديد':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'قيد التجهيز':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'تم الشحن':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'تم التسليم':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ملغي':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-white/10 text-white/70 border-white/10';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141b18] border border-white/10 p-6 rounded-2xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 font-medium">
              نظام إدارة مؤمن سنتر
            </span>
            <span className="text-xs text-white/40">تحديث فوري للمتجر</span>
          </div>
          <h2 className="text-2xl font-bold font-amiri text-white">مرحباً بك في لوحة تحكم المتجر</h2>
          <p className="text-xs md:text-sm text-white/60">
            يمكنك من هنا إدارة المنتجات، تتبع الطلبات، وتحديث أسعار ومخزون المتجر دون لمس الأكواد البرمجية.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => loadData()}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('new-product')}
            className="bg-gradient-to-r from-[#c5a059] to-[#dfba73] hover:opacity-95 text-[#0a0f0d] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 transition-transform active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ إضافة منتج جديد</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards (Phase 8 Requirement: Real data only) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Products */}
        <div className="bg-[#111815] border border-white/10 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">إجمالي المنتجات</span>
            <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white font-sans">
              {metrics ? metrics.totalProducts : 0}
            </span>
            <span className="text-[10px] text-white/40 block mt-0.5">منتج في النظام</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-[#111815] border border-white/10 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">منتجات معروضة</span>
            <PackageCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-bold text-emerald-400 font-sans">
              {metrics ? metrics.activeProducts : 0}
            </span>
            <span className="text-[10px] text-white/40 block mt-0.5">متاحة للشراء</span>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-[#111815] border border-white/10 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">نفد المخزون</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <span className="text-2xl font-bold text-red-400 font-sans">
              {metrics ? metrics.outOfStockProducts : 0}
            </span>
            <span className="text-[10px] text-white/40 block mt-0.5">تحتاج تزويد</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-[#111815] border border-white/10 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">طلبات جديدة</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-2xl font-bold text-amber-400 font-sans">
              {metrics ? metrics.pendingOrders : 0}
            </span>
            <span className="text-[10px] text-white/40 block mt-0.5">بانتظار المعالجة</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#111815] border border-white/10 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">إجمالي الطلبات</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white font-sans">
              {metrics ? metrics.totalOrders : 0}
            </span>
            <span className="text-[10px] text-white/40 block mt-0.5">طلب مسجل</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#111815] border border-white/10 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">المبيعات الحقيقية</span>
            <DollarSign className="w-4 h-4 text-[#c5a059]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 text-white font-sans">
              <span className="text-2xl font-bold">
                {metrics ? metrics.totalRevenue.toLocaleString('ar-SA') : '0'}
              </span>
              <span className="text-xs text-[#c5a059]">ر.س</span>
            </div>
            <span className="text-[10px] text-white/40 block mt-0.5">من الطلبات المكتملة</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-[#111815] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-amiri">الطلبات الأخيرة</h3>
              <p className="text-xs text-white/50">أحدث عمليات الشراء الواردة من المتجر</p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 font-medium"
            >
              <span>عرض كل الطلبات</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-white/40 text-xs">
              لا توجد طلبات مسجلة حتى الآن
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 pb-2">
                    <th className="pb-3 font-medium">رقم الطلب</th>
                    <th className="pb-3 font-medium">العميل</th>
                    <th className="pb-3 font-medium">المدينة</th>
                    <th className="pb-3 font-medium">الإجمالي</th>
                    <th className="pb-3 font-medium">الحالة</th>
                    <th className="pb-3 font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-mono font-medium text-[#c5a059]">{order.id}</td>
                      <td className="py-3 text-white font-medium">{order.customerName}</td>
                      <td className="py-3 text-white/70">{order.customerCity}</td>
                      <td className="py-3 font-sans font-bold text-white">
                        {order.total.toLocaleString()} ر.س
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-white/40 text-[11px] font-sans">
                        {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts (1 Column) */}
        <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white font-amiri">تنبيهات المخزون</h3>
                <p className="text-xs text-white/50">منتجات شارفت على النفاد</p>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 font-medium"
              >
                <span>المخزون</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-white/40 text-xs">
                جميع المنتجات تتمتع بمخزون كافٍ ومريح
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onNavigate('edit-product', { productId: p.id })}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-black"
                      />
                      <div>
                        <p className="text-xs font-medium text-white truncate max-w-[140px]">{p.name}</p>
                        <p className="text-[10px] text-white/50">{p.price} ر.س</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className={`text-xs font-bold font-sans px-2 py-0.5 rounded-full ${
                        p.stock === 0 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {p.stock === 0 ? 'نفد' : `${p.stock} متبقي`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => onNavigate('products')}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs border border-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <span>مراجعة وتعديل كميات المخزون</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
