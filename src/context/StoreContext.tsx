import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Product, Category, CategoryId } from '../types/product';
import type { CartItem, CheckoutFormData, Order } from '../types/cart';
import type { HomepageSettings } from '../types/admin';
import { products as initialProducts } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { StoreService, storeEvents } from '../services/storeService';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'gold';
}

interface StoreContextType {
  // Navigation / Route
  currentRoute: string;
  selectedProductId: string | null;
  selectedCategoryFilter: CategoryId | 'all';
  setSelectedCategoryFilter: (cat: CategoryId | 'all') => void;
  navigateTo: (route: string, productId?: string, category?: CategoryId | 'all') => void;

  // Live Database Products & Categories
  products: Product[];
  categories: Category[];
  homepageSettings: HomepageSettings | null;
  refreshStoreData: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  freeShippingThreshold: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View Modal
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Search Drawer
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'gold') => void;
  removeToast: (id: string) => void;

  // Orders
  lastOrder: Order | null;
  createOrder: (formData: CheckoutFormData) => Order;

  // Currency Formatter
  formatPrice: (price: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const FREE_SHIPPING_MIN = 2500;

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Products & Categories loaded from StoreService (with fallback to initial)
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);

  const refreshStoreData = useCallback(async () => {
    try {
      const [prods, cats, hp] = await Promise.all([
        StoreService.getPublicProducts(),
        StoreService.getCategories(),
        StoreService.getHomepageSettings(),
      ]);
      if (prods && prods.length > 0) setProductsList(prods);
      if (cats && cats.length > 0) setCategoriesList(cats.filter(c => c.status !== 'hidden'));
      if (hp) setHomepageSettings(hp);
    } catch (err) {
      console.warn('Failed to refresh live store data:', err);
    }
  }, []);

  useEffect(() => {
    refreshStoreData();
    const unsubscribe = storeEvents.subscribe(() => {
      refreshStoreData();
    });
    return unsubscribe;
  }, [refreshStoreData]);

  // Navigation state from window hash or default to 'home'
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryId | 'all'>('all');

  // Handle URL hash changes for robust routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === '/' || hash === 'home') {
        setCurrentRoute('home');
        setSelectedProductId(null);
      } else if (hash.startsWith('product/')) {
        const id = hash.replace('product/', '');
        setCurrentRoute('product');
        setSelectedProductId(id);
      } else if (hash.startsWith('shop')) {
        setCurrentRoute('shop');
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const cat = params.get('category') as CategoryId;
        if (cat) setSelectedCategoryFilter(cat);
      } else if (hash === 'cart') {
        setCurrentRoute('cart');
      } else if (hash === 'checkout') {
        setCurrentRoute('checkout');
      } else if (hash === 'wishlist') {
        setCurrentRoute('wishlist');
      } else if (hash.startsWith('admin')) {
        // Admin route handled at App level
        setCurrentRoute(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((route: string, productId?: string, category?: CategoryId | 'all') => {
    setCurrentRoute(route);
    if (category) setSelectedCategoryFilter(category);
    if (productId) setSelectedProductId(productId);

    if (route === 'home') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'product' && productId) {
      window.location.hash = `product/${productId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'shop') {
      window.location.hash = category && category !== 'all' ? `shop?category=${category}` : 'shop';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = route;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Cart state with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('momen_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('momen_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Wishlist state with localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('momen_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('momen_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // UI States
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Toast Dispatcher
  const addToast = useCallback((title: string, description?: string, type: 'success' | 'info' | 'gold' = 'gold') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cart Operations
  const addToCart = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
    });

    addToast('أضيف إلى حقيبة التسوق', `${product.name} (مقاس: ${size})`, 'gold');
    setIsCartDrawerOpen(true);
  }, [addToast]);

  const updateCartQuantity = useCallback((index: number, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, idx) => idx !== index);
      }
      const next = [...prev];
      next[index] = { ...next[index], quantity };
      return next;
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
    addToast('تمت إزالة القطعة من الحقيبة', undefined, 'info');
  }, [addToast]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Wishlist Operations
  const toggleWishlist = useCallback((productId: string) => {
    const product = productsList.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('تمت الإزالة من قائمة الرغبات', product?.name, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('أضيف إلى قائمة الرغبات المميزة', product?.name, 'gold');
        return [...prev, productId];
      }
    });
  }, [addToast, productsList]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  // Quick View
  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  // Create Order (Saves locally and syncs with StoreService)
  const createOrder = useCallback((formData: CheckoutFormData): Order => {
    const shipping = cartSubtotal >= FREE_SHIPPING_MIN ? 0 : 80;
    const discount = 0;
    const total = cartSubtotal + shipping - discount;

    const newOrder: Order = {
      id: `MC-${Date.now().toString().slice(-6)}`,
      items: [...cart],
      subtotal: cartSubtotal,
      shipping,
      discount,
      total,
      customer: formData,
      createdAt: new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setLastOrder(newOrder);

    // Also persist order to StoreService so it shows in Admin Orders!
    StoreService.createOrder({
      customerName: formData.fullName,
      customerPhone: formData.phone,
      customerCity: formData.city,
      customerAddress: `${formData.governorate} - ${formData.city} - ${formData.address}`,
      items: cart.map((c) => ({
        productId: c.product.id,
        name: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
        size: c.selectedSize,
        color: c.selectedColor,
        image: c.product.images[0],
      })),
      subtotal: cartSubtotal,
      shipping,
      total,
      status: 'جديد',
      paymentMethod: formData.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة مدى / ائتمانية',
      notes: formData.notes,
    }).catch((err) => console.warn('Could not sync order to store service:', err));

    clearCart();
    return newOrder;
  }, [cart, cartSubtotal, clearCart]);

  // Price Formatter (SAR / ر.س)
  const formatPrice = useCallback((price: number) => {
    return `${price.toLocaleString('ar-SA')} ر.س`;
  }, []);

  return (
    <StoreContext.Provider
      value={{
        currentRoute,
        selectedProductId,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        navigateTo,
        products: productsList,
        categories: categoriesList,
        homepageSettings,
        refreshStoreData,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        freeShippingThreshold: FREE_SHIPPING_MIN,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        lastOrder,
        createOrder,
        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
