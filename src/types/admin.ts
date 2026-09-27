export type UserRole = 'admin' | 'customer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
}

export type OrderStatus = 'جديد' | 'قيد التجهيز' | 'تم الشحن' | 'تم التسليم' | 'ملغي';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  minOrderAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface HomepageSettings {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  announcementText: string;
  announcementActive: boolean;
  featuredCategoryIds: string[];
  showTrendingSection: boolean;
}

export interface AdminMetrics {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  pendingOrders: number;
  totalOrders: number;
  totalRevenue: number;
}
