import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ClipboardList,
  Users,
  LayoutTemplate,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Plus,
  ShieldCheck,
  Search,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'new-product'
  | 'edit-product'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'homepage'
  | 'offers'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onNavigate: (tab: AdminTab, params?: { productId?: string }) => void;
  onBackToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onNavigate,
  onBackToStore,
  children,
}) => {
  const { user, logout } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'products', label: 'المنتجات والمخزون', icon: ShoppingBag },
    { id: 'categories', label: 'التصنيفات', icon: Layers },
    { id: 'orders', label: 'الطلبات والمبيعات', icon: ClipboardList },
    { id: 'customers', label: 'قائمة العملاء', icon: Users },
    { id: 'homepage', label: 'واجهة المتجر', icon: LayoutTemplate },
    { id: 'offers', label: 'العروض والخصومات', icon: Tag },
    { id: 'settings', label: 'الإعدادات وقاعدة البيانات', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0d1210] text-[#e8ece9] flex flex-col md:flex-row font-alexandria" dir="rtl">
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#131a16] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-white/80 hover:text-white rounded-lg bg-white/5 border border-white/10"
            aria-label="القائمة الجانبية"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] font-playfair font-bold text-sm">
              M
            </span>
            <span className="font-playfair font-bold text-sm text-white">MOMEN ADMIN</span>
          </div>
        </div>

        <button
          onClick={onBackToStore}
          className="text-xs text-[#c5a059] bg-[#c5a059]/10 px-3 py-1.5 rounded-full border border-[#c5a059]/30 flex items-center gap-1.5"
        >
          <span>المتجر</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 right-0 h-screen w-72 bg-[#111815] border-l border-white/10 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] font-playfair font-bold text-lg shadow-inner">
              M
            </div>
            <div>
              <h2 className="font-playfair font-bold text-base text-white tracking-wider">MOMEN CENTER</h2>
              <div className="flex items-center gap-1 text-[10px] text-[#c5a059] font-sans tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>PORTAL ADMIN</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-white/60 hover:text-white rounded-lg bg-white/5"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Product Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNavigate('new-product');
              setMobileMenuOpen(false);
            }}
            className="w-full bg-gradient-to-r from-[#c5a059] to-[#dfba73] hover:opacity-95 text-[#0a0f0d] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#c5a059]/10 transition-transform active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ إضافة منتج جديد</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === 'products' && (currentTab === 'new-product' || currentTab === 'edit-product'));
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 shadow-sm font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#c5a059]' : 'text-white/50'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Store Link & Admin Profile */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#0d1310]/50">
          <button
            onClick={onBackToStore}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>معاينة متجر مؤمن سنتر</span>
            </span>
            <span className="text-[10px] text-white/40">الواجهة العامة</span>
          </button>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold text-white">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user?.name || 'مدير النظام'}</p>
                <p className="text-[10px] text-emerald-400 font-sans">Role: Admin</p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="تسجيل الخروج"
              className="p-2 text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#111815]/70 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-white font-amiri tracking-wide">
              {navItems.find(i => i.id === currentTab)?.label || 'لوحة إدارة المتجر'}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              النظام متصل
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="بحث سريع في المتجر..."
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-9 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#c5a059] w-64 transition-all"
              />
              <Search className="w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors relative"
                aria-label="التنبيهات"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c5a059]" />
              </button>

              {notificationsOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-[#16201b] border border-white/15 rounded-xl shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-bold text-white">
                    <span>التنبيهات الأخيرة</span>
                    <span className="text-[10px] text-[#c5a059]">3 تنبيهات</span>
                  </div>
                  <div className="space-y-2 mt-2 text-xs">
                    <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <p className="font-medium text-white">طلب جديد #MC-2026-8901</p>
                      <p className="text-[10px] text-white/50">منذ 15 دقيقة • فاطمة المحمدي</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <p className="font-medium text-[#c5a059]">تنبيه مخزون منخفض</p>
                      <p className="text-[10px] text-white/50">فستان الزمرد الحريري (باقي 2 قطع)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Public Storefront button */}
            <button
              onClick={onBackToStore}
              className="flex items-center gap-2 text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-colors"
            >
              <span>مشاهدة المتجر</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
