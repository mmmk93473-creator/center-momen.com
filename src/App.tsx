import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProductQuickView } from './components/shop/ProductQuickView';
import { CartDrawer } from './components/shop/CartDrawer';
import { SearchOverlay } from './components/shop/SearchOverlay';
import { ScrollProgress } from './components/common/ScrollProgress';
import { ToastContainer } from './components/common/Toast';

// Admin Components & Pages
import { AdminLayout, type AdminTab } from './components/admin/AdminLayout';
import {
  AdminLogin,
  AdminDashboard,
  AdminProducts,
  AdminProductForm,
  AdminCategories,
  AdminOrders,
  AdminCustomers,
  AdminHomepage,
  AdminOffers,
  AdminSettings,
} from './pages/admin';

const AppContent: React.FC = () => {
  const { currentRoute } = useStore();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAdmin();

  // Admin Sub-route parser
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [editingProductId, setEditingProductId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (currentRoute.startsWith('admin')) {
      const parts = currentRoute.split('/');
      // e.g. 'admin' or 'admin/products' or 'admin/products/new' or 'admin/products/edit/123'
      if (parts.length === 1 || parts[1] === '') {
        setAdminTab('dashboard');
        setEditingProductId(undefined);
      } else if (parts[1] === 'products') {
        if (parts[2] === 'new') {
          setAdminTab('new-product');
          setEditingProductId(undefined);
        } else if (parts[2] === 'edit' && parts[3]) {
          setAdminTab('edit-product');
          setEditingProductId(parts[3]);
        } else {
          setAdminTab('products');
          setEditingProductId(undefined);
        }
      } else if (parts[1] === 'categories') {
        setAdminTab('categories');
      } else if (parts[1] === 'orders') {
        setAdminTab('orders');
      } else if (parts[1] === 'customers') {
        setAdminTab('customers');
      } else if (parts[1] === 'homepage') {
        setAdminTab('homepage');
      } else if (parts[1] === 'offers') {
        setAdminTab('offers');
      } else if (parts[1] === 'settings') {
        setAdminTab('settings');
      }
    }
  }, [currentRoute]);

  // Handle Admin Experience
  if (currentRoute.startsWith('admin')) {
    // 1. Login Page Route
    if (currentRoute === 'admin/login') {
      if (isAuthenticated && isAdmin) {
        window.location.hash = 'admin';
        return null;
      }
      return (
        <AdminLogin
          onSuccess={() => {
            window.location.hash = 'admin';
          }}
          onBackToStore={() => {
            window.location.hash = '';
          }}
        />
      );
    }

    // 2. Protected Admin Dashboard Routes
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#0d1210] flex flex-col items-center justify-center text-white space-y-4 font-alexandria">
          <div className="w-10 h-10 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-white/50 tracking-wider">جاري التحقق من صلاحيات الإدارة...</p>
        </div>
      );
    }

    // Unauthenticated or not admin: Redirect to login or deny access (RBAC Guard)
    if (!isAuthenticated || !isAdmin) {
      return (
        <AdminLogin
          onSuccess={() => {
            window.location.hash = 'admin';
          }}
          onBackToStore={() => {
            window.location.hash = '';
          }}
        />
      );
    }

    // Authenticated Admin Dashboard Layout
    return (
      <AdminLayout
        currentTab={adminTab}
        onNavigate={(tab, params) => {
          if (tab === 'new-product') {
            window.location.hash = 'admin/products/new';
          } else if (tab === 'edit-product' && params?.productId) {
            window.location.hash = `admin/products/edit/${params.productId}`;
          } else if (tab === 'dashboard') {
            window.location.hash = 'admin';
          } else {
            window.location.hash = `admin/${tab}`;
          }
        }}
        onBackToStore={() => {
          window.location.hash = '';
        }}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigate={(tab, params) => {
              if (tab === 'new-product') window.location.hash = 'admin/products/new';
              else if (tab === 'edit-product' && params?.productId) window.location.hash = `admin/products/edit/${params.productId}`;
              else if (tab === 'dashboard') window.location.hash = 'admin';
              else window.location.hash = `admin/${tab}`;
            }}
          />
        )}
        {adminTab === 'products' && (
          <AdminProducts
            onNavigate={(tab, params) => {
              if (tab === 'new-product') window.location.hash = 'admin/products/new';
              else if (tab === 'edit-product' && params?.productId) window.location.hash = `admin/products/edit/${params.productId}`;
              else if (tab === 'dashboard') window.location.hash = 'admin';
              else window.location.hash = `admin/${tab}`;
            }}
          />
        )}
        {adminTab === 'new-product' && (
          <AdminProductForm
            onNavigate={(tab) => {
              window.location.hash = tab === 'dashboard' ? 'admin' : `admin/${tab}`;
            }}
          />
        )}
        {adminTab === 'edit-product' && (
          <AdminProductForm
            productId={editingProductId}
            onNavigate={(tab) => {
              window.location.hash = tab === 'dashboard' ? 'admin' : `admin/${tab}`;
            }}
          />
        )}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'customers' && <AdminCustomers />}
        {adminTab === 'homepage' && <AdminHomepage />}
        {adminTab === 'offers' && <AdminOffers />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Handle Public Storefront Experience (Unchanged, 100% Intact)
  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Reading Line & Scroll Progress */}
      <ScrollProgress />

      {/* Main Header */}
      <Header />

      {/* Dynamic Page Content */}
      <main style={{ flex: 1 }}>
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals & Global Drawers */}
      <ProductQuickView />
      <CartDrawer />
      <SearchOverlay />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </StoreProvider>
  );
}
