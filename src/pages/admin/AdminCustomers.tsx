import React, { useEffect, useState } from 'react';
import { StoreService } from '../../services/storeService';
import type { AdminOrder } from '../../types/admin';
import { MapPin, Search } from 'lucide-react';

interface CustomerSummary {
  name: string;
  phone: string;
  email?: string;
  city: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      try {
        const orders = await StoreService.getOrders();
        // Aggregate customer data safely from completed orders
        const map = new Map<string, CustomerSummary>();

        orders.forEach((o: AdminOrder) => {
          const key = o.customerPhone.trim();
          if (!map.has(key)) {
            map.set(key, {
              name: o.customerName,
              phone: o.customerPhone,
              email: o.customerEmail,
              city: o.customerCity,
              orderCount: 1,
              totalSpent: o.total,
              lastOrderDate: o.createdAt,
            });
          } else {
            const existing = map.get(key)!;
            existing.orderCount += 1;
            existing.totalSpent += o.total;
            if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
              existing.lastOrderDate = o.createdAt;
              existing.city = o.customerCity;
            }
          }
        });

        setCustomers(Array.from(map.values()));
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold font-amiri text-white">قائمة عميلات مؤمن سنتر</h2>
        <p className="text-xs text-white/50">
          إدارة سجل العميلات، تكرار الشراء، وإجمالي المشتريات مع الحفاظ على أعلى معايير الخصوصية
        </p>
      </div>

      {/* Search */}
      <div className="bg-[#111815] border border-white/10 rounded-2xl p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم العميلة، الجوال، أو المدينة..."
            className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 pr-10 text-xs text-white placeholder-white/40 focus:outline-none transition-all"
          />
          <Search className="w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
        </div>
      </div>

      {/* Customers List */}
      {loading ? (
        <div className="py-20 text-center text-white/50 space-y-3">
          <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">جاري تحليل بيانات العميلات...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-[#111815] border border-white/10 rounded-2xl p-12 text-center text-white/50 text-xs">
          لا توجد سجلات تطابق البحث
        </div>
      ) : (
        <div className="bg-[#111815] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#16201b] border-b border-white/10 text-white/60">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">العميلة</th>
                  <th className="py-3.5 px-4 font-semibold">رقم الجوال</th>
                  <th className="py-3.5 px-4 font-semibold">المدينة</th>
                  <th className="py-3.5 px-4 font-semibold">عدد الطلبات</th>
                  <th className="py-3.5 px-4 font-semibold">إجمالي المشتريات</th>
                  <th className="py-3.5 px-4 font-semibold">آخر طلب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c5a059]/20 text-[#c5a059] font-bold text-xs flex items-center justify-center">
                          {c.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          {c.email && <p className="text-[10px] text-white/40">{c.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-white/70" dir="ltr">
                      {c.phone}
                    </td>
                    <td className="py-3.5 px-4 text-white/70">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#c5a059]" />
                        <span>{c.city}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-white">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {c.orderCount} طلب
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-[#c5a059]">
                      {c.totalSpent.toLocaleString()} ر.س
                    </td>
                    <td className="py-3.5 px-4 text-white/40 font-sans text-[11px]">
                      {new Date(c.lastOrderDate).toLocaleDateString('ar-SA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
