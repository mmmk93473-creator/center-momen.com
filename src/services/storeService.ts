import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product, Category, ProductStatus } from '../types/product';
import type { AdminOrder, Offer, HomepageSettings, OrderStatus, AdminMetrics } from '../types/admin';
import { products as defaultProducts } from '../data/products';
import { categories as defaultCategories } from '../data/categories';

// Event emitter for cross-component reactive updates
type StoreListener = () => void;
class StoreEventEmitter {
  private listeners: StoreListener[] = [];
  subscribe(listener: StoreListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  emit() {
    this.listeners.forEach(l => l());
  }
}
export const storeEvents = new StoreEventEmitter();

// LocalStorage Keys
const STORAGE_KEYS = {
  PRODUCTS: 'momen_center_products_v2',
  CATEGORIES: 'momen_center_categories_v2',
  ORDERS: 'momen_center_orders_v2',
  OFFERS: 'momen_center_offers_v2',
  HOMEPAGE: 'momen_center_homepage_v2',
};

// Initial Seed Orders
const initialOrders: AdminOrder[] = [
  {
    id: 'MC-2026-8901',
    customerName: 'فاطمة المحمدي',
    customerPhone: '0501234567',
    customerEmail: 'fatima.m@example.com',
    customerCity: 'الرياض',
    customerAddress: 'حي النخيل، شارع الأمير سلطان، فيلا 14',
    items: [
      {
        productId: 'momen-emerald-dress-01',
        name: 'فستان الزمرد الملكي الحريري',
        price: 3850,
        quantity: 1,
        size: 'M',
        color: 'ميرمية زيتوني',
        image: '/hero-frames/frame_240.webp',
      },
    ],
    subtotal: 3850,
    shipping: 0,
    total: 3850,
    status: 'جديد',
    paymentMethod: 'الدفع عند الاستلام',
    createdAt: '2026-09-26T14:30:00Z',
    updatedAt: '2026-09-26T14:30:00Z',
  },
  {
    id: 'MC-2026-8900',
    customerName: 'سارة العتيبي',
    customerPhone: '0559876543',
    customerEmail: 'sara.o@example.com',
    customerCity: 'جدة',
    customerAddress: 'حي الروضة، طريق الكورنيش، برج الأندلس',
    items: [
      {
        productId: 'dresses-02',
        name: 'فستان السهرة المخملي الأسود المرصع',
        price: 4200,
        quantity: 1,
        size: 'L',
        color: 'أسود ملكي',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
      },
      {
        productId: 'acc-01',
        name: 'حقيبة كليوباترا الجلدية المزخرفة يدوياً',
        price: 1850,
        quantity: 1,
        size: 'Standard',
        color: 'أسود فحمي',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      },
    ],
    subtotal: 6050,
    shipping: 0,
    total: 6050,
    status: 'قيد التجهيز',
    paymentMethod: 'بطاقة مدى / ائتمانية',
    createdAt: '2026-09-25T19:15:00Z',
    updatedAt: '2026-09-26T09:00:00Z',
  },
  {
    id: 'MC-2026-8898',
    customerName: 'نورة الدوسري',
    customerPhone: '0543322110',
    customerCity: 'الخبر',
    customerAddress: 'حي الحزام الذهبي، مجمع السيف السكني',
    items: [
      {
        productId: 'jackets-01',
        name: 'بليزر التويد العاجي الموشى بخيوط الفضة',
        price: 3200,
        quantity: 1,
        size: 'S',
        color: 'عاجي لؤلؤي',
        image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?q=80&w=1000&auto=format&fit=crop',
      },
    ],
    subtotal: 3200,
    shipping: 0,
    total: 3200,
    status: 'تم الشحن',
    paymentMethod: 'Apple Pay',
    createdAt: '2026-09-24T11:20:00Z',
    updatedAt: '2026-09-25T16:00:00Z',
  },
];

// Initial Offers
const initialOffers: Offer[] = [
  {
    id: 'offer-momen10',
    code: 'MOMEN10',
    title: 'خصم الترحيب بالأعضاء الجدد',
    discountPercent: 10,
    minOrderAmount: 1000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    usageCount: 48,
  },
  {
    id: 'offer-vip15',
    code: 'VIP15',
    title: 'عرض النخبة لتشكيلة الصيف',
    discountPercent: 15,
    minOrderAmount: 3000,
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    isActive: true,
    usageCount: 22,
  },
];

// Initial Homepage Settings
const initialHomepage: HomepageSettings = {
  heroBadge: 'تشكيلة صيف وخريف 2026 الحصرية',
  heroTitle: 'فخامة لا تشبه إلا حضورك الملكي',
  heroSubtitle: 'دار أزياء نسائية سعودية رفيعة المستوى، تصاميم هوت كوتور تنسدل بأنوثة حالمة وأقمشة حريرية إيطالية نادرة.',
  heroCtaText: 'اكتشفي المجموعة الفاخرة',
  announcementText: 'توصيل مجاني لجميع مناطق المملكة للطلبات فوق 500 ريال | هدايا حصرية مع كل طلب',
  announcementActive: true,
  featuredCategoryIds: ['dresses', 'blouses', 'jackets', 'accessories'],
  showTrendingSection: true,
};

// Helper: Get local storage item safely
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

// Helper: Set local storage item safely
function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

// Service class
export class StoreService {
  // PRODUCTS
  static async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            name: item.name,
            nameEn: item.name_en || item.name,
            category: item.category_id || item.category,
            price: Number(item.price),
            oldPrice: item.old_price ? Number(item.old_price) : undefined,
            discount: item.discount ? Number(item.discount) : undefined,
            images: item.images || [],
            description: item.description || '',
            fabric: item.fabric || '',
            care: item.care || '',
            sizes: item.sizes || ['S', 'M', 'L'],
            colors: item.colors || [],
            rating: item.rating ? Number(item.rating) : 5,
            reviews: item.reviews ? Number(item.reviews) : 0,
            stock: Number(item.stock ?? 10),
            status: (item.status as ProductStatus) || 'published',
            featured: Boolean(item.featured),
            newArrival: Boolean(item.new_arrival),
            bestSeller: Boolean(item.best_seller),
            trending: Boolean(item.trending),
            season: item.season || '2026',
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local:', err);
      }
    }

    // Local fallback
    const saved = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    if (!saved || saved.length === 0) {
      // Initialize with default products having 'published' status
      const mappedDefaults: Product[] = defaultProducts.map(p => ({
        ...p,
        status: p.status || 'published',
      }));
      setLocal(STORAGE_KEYS.PRODUCTS, mappedDefaults);
      return mappedDefaults;
    }
    return saved;
  }

  // Get active products for public storefront
  static async getPublicProducts(): Promise<Product[]> {
    const all = await this.getProducts();
    return all.filter(p => p.status === 'published' || !p.status);
  }

  static async getProductById(id: string): Promise<Product | null> {
    const all = await this.getProducts();
    return all.find(p => p.id === id) || null;
  }

  static async saveProduct(productData: Partial<Product> & { name: string; price: number; category: string }): Promise<Product> {
    const now = new Date().toISOString();
    const id = productData.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newProduct: Product = {
      id,
      name: productData.name,
      nameEn: productData.nameEn || productData.name,
      category: productData.category,
      price: productData.price,
      oldPrice: productData.oldPrice,
      discount: productData.discount,
      images: productData.images && productData.images.length > 0 ? productData.images : ['/hero-frames/frame_240.webp'],
      description: productData.description || '',
      fabric: productData.fabric || 'حرير طبيعي فاخر',
      care: productData.care || 'تنظيف جاف فقط',
      sizes: productData.sizes && productData.sizes.length > 0 ? productData.sizes : ['S', 'M', 'L', 'XL'],
      colors: productData.colors && productData.colors.length > 0 ? productData.colors : [{ name: 'افتراضي', hex: '#111111' }],
      rating: productData.rating ?? 5.0,
      reviews: productData.reviews ?? 1,
      stock: Math.max(0, productData.stock ?? 10),
      status: productData.status || 'published',
      featured: productData.featured ?? false,
      newArrival: productData.newArrival ?? true,
      bestSeller: productData.bestSeller ?? false,
      trending: productData.trending ?? false,
      season: productData.season || '2026',
      createdAt: productData.createdAt || now,
      updatedAt: now,
    };

    if (isSupabaseConfigured) {
      try {
        const payload = {
          id: newProduct.id,
          name: newProduct.name,
          name_en: newProduct.nameEn,
          category_id: newProduct.category,
          price: newProduct.price,
          old_price: newProduct.oldPrice,
          discount: newProduct.discount,
          images: newProduct.images,
          description: newProduct.description,
          fabric: newProduct.fabric,
          care: newProduct.care,
          sizes: newProduct.sizes,
          colors: newProduct.colors,
          rating: newProduct.rating,
          reviews: newProduct.reviews,
          stock: newProduct.stock,
          status: newProduct.status,
          featured: newProduct.featured,
          new_arrival: newProduct.newArrival,
          best_seller: newProduct.bestSeller,
          trending: newProduct.trending,
          season: newProduct.season,
          updated_at: now,
        };

        const { error } = await supabase.from('products').upsert(payload);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase upsert product failed, persisting locally:', err);
      }
    }

    // Always update local cache for instant UI response
    const current = await this.getProducts();
    const index = current.findIndex(p => p.id === id);
    if (index >= 0) {
      current[index] = newProduct;
    } else {
      current.unshift(newProduct);
    }
    setLocal(STORAGE_KEYS.PRODUCTS, current);
    storeEvents.emit();

    return newProduct;
  }

  static async updateProductStatus(id: string, status: ProductStatus): Promise<Product | null> {
    const product = await this.getProductById(id);
    if (!product) return null;
    return this.saveProduct({ ...product, status });
  }

  static async updateProductStock(id: string, newStock: number): Promise<Product | null> {
    const product = await this.getProductById(id);
    if (!product) return null;
    return this.saveProduct({ ...product, stock: Math.max(0, newStock) });
  }

  static async deleteOrArchiveProduct(id: string, hardDelete = false): Promise<boolean> {
    if (isSupabaseConfigured && hardDelete) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete product failed:', err);
      }
    }

    const current = await this.getProducts();
    if (hardDelete) {
      const filtered = current.filter(p => p.id !== id);
      setLocal(STORAGE_KEYS.PRODUCTS, filtered);
    } else {
      // Soft archive / hide
      const index = current.findIndex(p => p.id === id);
      if (index >= 0) {
        current[index] = { ...current[index], status: 'archived', updatedAt: new Date().toISOString() };
        setLocal(STORAGE_KEYS.PRODUCTS, current);
      }
    }
    storeEvents.emit();
    return true;
  }

  // CATEGORIES
  static async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map(c => ({
            id: c.id,
            name: c.name,
            nameEn: c.name_en || c.name,
            description: c.description || '',
            image: c.image || '',
            count: Number(c.count ?? 0),
            status: c.status || 'active',
          }));
        }
      } catch (err) {
        console.warn('Supabase get categories failed:', err);
      }
    }

    const saved = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    if (!saved || saved.length === 0) {
      setLocal(STORAGE_KEYS.CATEGORIES, defaultCategories);
      return defaultCategories;
    }
    return saved;
  }

  static async saveCategory(category: Category): Promise<Category> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('categories').upsert({
          id: category.id,
          name: category.name,
          name_en: category.nameEn,
          description: category.description,
          image: category.image,
          status: category.status || 'active',
        });
      } catch (err) {
        console.warn('Supabase upsert category failed:', err);
      }
    }

    const current = await this.getCategories();
    const index = current.findIndex(c => c.id === category.id);
    if (index >= 0) {
      current[index] = category;
    } else {
      current.push(category);
    }
    setLocal(STORAGE_KEYS.CATEGORIES, current);
    storeEvents.emit();
    return category;
  }

  static async deleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete category failed:', err);
      }
    }
    const current = await this.getCategories();
    const filtered = current.filter(c => c.id !== id);
    setLocal(STORAGE_KEYS.CATEGORIES, filtered);
    storeEvents.emit();
    return true;
  }

  // ORDERS
  static async getOrders(): Promise<AdminOrder[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(o => ({
            id: o.id,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            customerEmail: o.customer_email,
            customerCity: o.customer_city,
            customerAddress: o.customer_address,
            items: (o.order_items || []).map((it: { product_id: string; name: string; price: number; quantity: number; size?: string; color?: string; image?: string }) => ({
              productId: it.product_id,
              name: it.name,
              price: Number(it.price),
              quantity: Number(it.quantity),
              size: it.size,
              color: it.color,
              image: it.image,
            })),
            subtotal: Number(o.subtotal),
            shipping: Number(o.shipping),
            total: Number(o.total),
            status: o.status as OrderStatus,
            notes: o.notes,
            paymentMethod: o.payment_method,
            createdAt: o.created_at,
            updatedAt: o.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase get orders failed:', err);
      }
    }

    const saved = getLocal<AdminOrder[]>(STORAGE_KEYS.ORDERS, []);
    if (!saved || saved.length === 0) {
      setLocal(STORAGE_KEYS.ORDERS, initialOrders);
      return initialOrders;
    }
    return saved;
  }

  static async createOrder(orderData: Omit<AdminOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminOrder> {
    const now = new Date().toISOString();
    const orderId = `MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: AdminOrder = {
      ...orderData,
      id: orderId,
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').insert({
          id: newOrder.id,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          customer_email: newOrder.customerEmail,
          customer_city: newOrder.customerCity,
          customer_address: newOrder.customerAddress,
          subtotal: newOrder.subtotal,
          shipping: newOrder.shipping,
          total: newOrder.total,
          status: newOrder.status,
          notes: newOrder.notes,
          payment_method: newOrder.paymentMethod,
        });

        if (newOrder.items.length > 0) {
          await supabase.from('order_items').insert(
            newOrder.items.map(it => ({
              order_id: newOrder.id,
              product_id: it.productId,
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              size: it.size,
              color: it.color,
              image: it.image,
            }))
          );
        }
      } catch (err) {
        console.warn('Supabase create order failed:', err);
      }
    }

    const orders = await this.getOrders();
    orders.unshift(newOrder);
    setLocal(STORAGE_KEYS.ORDERS, orders);
    storeEvents.emit();

    return newOrder;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<AdminOrder | null> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').update({ status, updated_at: now }).eq('id', orderId);
      } catch (err) {
        console.warn('Supabase update order status failed:', err);
      }
    }

    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index >= 0) {
      orders[index] = { ...orders[index], status, updatedAt: now };
      setLocal(STORAGE_KEYS.ORDERS, orders);
      storeEvents.emit();
      return orders[index];
    }
    return null;
  }

  // OFFERS
  static async getOffers(): Promise<Offer[]> {
    const saved = getLocal<Offer[]>(STORAGE_KEYS.OFFERS, []);
    if (!saved || saved.length === 0) {
      setLocal(STORAGE_KEYS.OFFERS, initialOffers);
      return initialOffers;
    }
    return saved;
  }

  static async saveOffer(offer: Offer): Promise<Offer> {
    const offers = await this.getOffers();
    const index = offers.findIndex(o => o.id === offer.id);
    if (index >= 0) {
      offers[index] = offer;
    } else {
      offers.unshift(offer);
    }
    setLocal(STORAGE_KEYS.OFFERS, offers);
    storeEvents.emit();
    return offer;
  }

  static async deleteOffer(id: string): Promise<boolean> {
    const offers = await this.getOffers();
    const filtered = offers.filter(o => o.id !== id);
    setLocal(STORAGE_KEYS.OFFERS, filtered);
    storeEvents.emit();
    return true;
  }

  // HOMEPAGE SETTINGS
  static async getHomepageSettings(): Promise<HomepageSettings> {
    return getLocal<HomepageSettings>(STORAGE_KEYS.HOMEPAGE, initialHomepage);
  }

  static async saveHomepageSettings(settings: HomepageSettings): Promise<HomepageSettings> {
    setLocal(STORAGE_KEYS.HOMEPAGE, settings);
    storeEvents.emit();
    return settings;
  }

  // METRICS
  static async getMetrics(): Promise<AdminMetrics> {
    const products = await this.getProducts();
    const orders = await this.getOrders();

    const activeProducts = products.filter(p => p.status === 'published' && p.stock > 0).length;
    const outOfStockProducts = products.filter(p => p.stock <= 0).length;
    const pendingOrders = orders.filter(o => o.status === 'جديد' || o.status === 'قيد التجهيز').length;
    const totalRevenue = orders
      .filter(o => o.status !== 'ملغي')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      totalProducts: products.length,
      activeProducts,
      outOfStockProducts,
      pendingOrders,
      totalOrders: orders.length,
      totalRevenue,
    };
  }

  // IMAGE UPLOADS
  static async uploadImage(file: File): Promise<string> {
    // Validate file type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validMimes.includes(file.type)) {
      throw new Error('نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG أو PNG أو WebP');
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('حجم الصورة كبير جداً. الحد الأقصى هو 5 ميجابايت');
    }

    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
          if (data && data.publicUrl) {
            return data.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, falling back to local data URL:', err);
      }
    }

    // Local fallback via FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('فشل قراءة ملف الصورة'));
        }
      };
      reader.onerror = () => reject(new Error('حدث خطأ أثناء تحميل الصورة'));
      reader.readAsDataURL(file);
    });
  }
}
