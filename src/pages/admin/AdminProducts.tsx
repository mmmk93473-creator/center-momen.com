import React, { useEffect, useState } from 'react';
import { StoreService, storeEvents } from '../../services/storeService';
import type { Product, ProductStatus, Category } from '../../types/product';
import type { AdminTab } from '../../components/admin/AdminLayout';
import {
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  AlertCircle,
  Archive,
  Star,
  Sparkles,
  Flame,
  RefreshCw,
} from 'lucide-react';

interface AdminProductsProps {
  onNavigate: (tab: AdminTab, params?: { productId?: string }) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStock, setSelectedStock] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priceAsc' | 'priceDesc' | 'stockAsc'>('newest');

  // Delete / Archive Modal
  const [deleteModalProduct, setDeleteModalProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        StoreService.getProducts(),
        StoreService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products:', err);
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

  // Status toggle (Hide / Show)
  const handleToggleStatus = async (product: Product) => {
    const nextStatus: ProductStatus = product.status === 'published' ? 'hidden' : 'published';
    await StoreService.updateProductStatus(product.id, nextStatus);
    showToast(nextStatus === 'published' ? `تم نشر المنتج "${product.name}" بنجاح` : `تم إخفاء المنتج "${product.name}"`);
  };

  // Stock quick adjustment
  const handleStockChange = async (productId: string, newStock: number) => {
    if (newStock < 0) return;
    await StoreService.updateProductStock(productId, newStock);
    showToast('تم تحديث المخزون بنجاح');
  };

  // Archive or Hard Delete confirmation
  const handleConfirmDelete = async (hardDelete: boolean) => {
    if (!deleteModalProduct) return;
    setDeleting(true);
    try {
      await StoreService.deleteOrArchiveProduct(deleteModalProduct.id, hardDelete);
      showToast(hardDelete ? 'تم حذف المنتج نهائياً' : 'تم أرشفة المنتج وإخفائه من المتجر');
      setDeleteModalProduct(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Filtered & Sorted products
  const filteredProducts = products.filter((p) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchEn = p.nameEn.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchEn && !matchDesc) return false;
    }

    // Category
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    // Status
    if (selectedStatus !== 'all') {
      const pStatus = p.status || 'published';
      if (pStatus !== selectedStatus) return false;
    }

    // Stock
    if (selectedStock === 'in-stock' && p.stock <= 0) return false;
    if (selectedStock === 'low-stock' && (p.stock <= 0 || p.stock > 5)) return false;
    if (selectedStock === 'out-of-stock' && p.stock > 0) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
    if (sortBy === 'oldest') return (a.createdAt || '').localeCompare(b.createdAt || '');
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'stockAsc') return a.stock - b.stock;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#16291e] border border-emerald-500/40 text-emerald-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-[#c5a059]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-amiri text-white">إدارة المنتجات والمخزون</h2>
          <p className="text-xs text-white/50">
            إجمالي {products.length} منتج مسجل في النظام • {filteredProducts.length} معروض حالياً
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            <span>+ إضافة منتج</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111815] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الفستان أو الوصف..."
              className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 pr-10 text-xs text-white placeholder-white/40 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#16201b] border border-white/15 focus:border-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-all"
            >
              <option value="all">جميع التصنيفات</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#16201b] border border-white/15 focus:border-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-all"
            >
              <option value="all">جميع الحالات</option>
              <option value="published">معروض (Published)</option>
              <option value="hidden">مخفي (Hidden)</option>
              <option value="draft">مسودة (Draft)</option>
              <option value="archived">مؤرشف (Archived)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#16201b] border border-white/15 focus:border-[#c5a059] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-all"
            >
              <option value="newest">الترتيب: الأحدث</option>
              <option value="oldest">الترتيب: الأقدم</option>
              <option value="priceDesc">السعر: من الأعلى</option>
              <option value="priceAsc">السعر: من الأقل</option>
              <option value="stockAsc">المخزون: الأقل توفراً</option>
            </select>
          </div>
        </div>

        {/* Quick stock status pill filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs">
          <span className="text-white/40 text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>حالة المخزون:</span>
          </span>
          {[
            { id: 'all', label: 'الكل' },
            { id: 'in-stock', label: 'متوفر' },
            { id: 'low-stock', label: 'مخزون منخفض (≤ 5)' },
            { id: 'out-of-stock', label: 'نفد المخزون (0)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedStock(item.id)}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                selectedStock === item.id
                  ? 'bg-[#c5a059] text-[#0a0f0d] font-bold'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#111815] border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">لا توجد منتجات مطابقة لخيارات البحث</h3>
          <p className="text-xs text-white/50">جرب تغيير شروط الفلترة أو أضف منتجاً جديداً للمتجر</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSelectedStock('all');
            }}
            className="text-xs text-[#c5a059] underline"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="bg-[#111815] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#16201b] border-b border-white/10 text-white/60">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">المنتج</th>
                  <th className="py-3.5 px-4 font-semibold">التصنيف</th>
                  <th className="py-3.5 px-4 font-semibold">السعر</th>
                  <th className="py-3.5 px-4 font-semibold">المخزون</th>
                  <th className="py-3.5 px-4 font-semibold">الحالة</th>
                  <th className="py-3.5 px-4 font-semibold">المميزات</th>
                  <th className="py-3.5 px-4 font-semibold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((p) => {
                  const status = p.status || 'published';
                  const cat = categories.find((c) => c.id === p.category);
                  const isOutOfStock = p.stock <= 0;
                  const isLowStock = p.stock > 0 && p.stock <= 5;

                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || '/hero-frames/frame_240.webp'}
                            alt={p.name}
                            className="w-12 h-14 rounded-lg object-cover bg-black border border-white/10 shrink-0"
                          />
                          <div className="max-w-[220px]">
                            <p className="font-semibold text-white truncate text-xs">{p.name}</p>
                            <p className="text-[10px] text-white/40 truncate font-sans">{p.nameEn}</p>
                            <p className="text-[10px] text-[#c5a059] mt-0.5">
                              {p.sizes.slice(0, 3).join(', ')}{p.sizes.length > 3 ? '...' : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-white/70">
                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px]">
                          {cat ? cat.name : p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-white text-sm">{p.price.toLocaleString()} ر.س</div>
                        {p.oldPrice && (
                          <div className="text-[10px] text-white/40 line-through">
                            {p.oldPrice.toLocaleString()} ر.س
                          </div>
                        )}
                      </td>

                      {/* Stock with quick modifier */}
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStockChange(p.id, p.stock - 1)}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold"
                            title="إنقاص المخزون"
                          >
                            -
                          </button>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              isOutOfStock
                                ? 'bg-red-500/20 text-red-400'
                                : isLowStock
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleStockChange(p.id, p.stock + 1)}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold"
                            title="زيادة المخزون"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[10px] text-white/40 block mt-1">
                          {isOutOfStock ? 'نفد المخزون' : isLowStock ? 'مخزون منخفض' : 'متوفر'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : status === 'hidden'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : status === 'draft'
                              ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                              : 'bg-white/10 text-white/50 border-white/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            status === 'published' ? 'bg-emerald-400' : status === 'hidden' ? 'bg-amber-400' : 'bg-white/40'
                          }`} />
                          <span>
                            {status === 'published' ? 'معروض' : status === 'hidden' ? 'مخفي' : status === 'draft' ? 'مسودة' : 'مؤرشف'}
                          </span>
                        </span>
                      </td>

                      {/* Flags */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-[10px]">
                          {p.newArrival && (
                            <span className="p-1 rounded bg-[#c5a059]/10 text-[#c5a059]" title="وصل حديثاً">
                              <Sparkles className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {p.bestSeller && (
                            <span className="p-1 rounded bg-amber-500/10 text-amber-400" title="الأكثر مبيعاً">
                              <Flame className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {p.featured && (
                            <span className="p-1 rounded bg-purple-500/10 text-purple-400" title="مميز">
                              <Star className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit */}
                          <button
                            onClick={() => onNavigate('edit-product', { productId: p.id })}
                            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="تعديل المنتج"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Toggle Status (Hide / Show) */}
                          <button
                            onClick={() => handleToggleStatus(p)}
                            className="p-1.5 text-white/70 hover:text-[#c5a059] hover:bg-white/10 rounded-lg transition-colors"
                            title={status === 'published' ? 'إخفاء عن المتجر' : 'إظهار في المتجر'}
                          >
                            {status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>

                          {/* Delete / Archive */}
                          <button
                            onClick={() => setDeleteModalProduct(p)}
                            className="p-1.5 text-red-400/70 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="حذف أو أرشفة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden divide-y divide-white/10 p-4 space-y-4">
            {filteredProducts.map((p) => {
              const status = p.status || 'published';
              const cat = categories.find((c) => c.id === p.category);
              return (
                <div key={p.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={p.images[0] || '/hero-frames/frame_240.webp'}
                      alt={p.name}
                      className="w-16 h-20 rounded-lg object-cover bg-black shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50">{cat ? cat.name : p.category}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {status === 'published' ? 'معروض' : 'مخفي'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white truncate mt-0.5">{p.name}</h4>
                      <p className="text-xs font-bold text-[#c5a059] font-sans mt-1">
                        {p.price.toLocaleString()} ر.س
                      </p>
                      <p className="text-[10px] text-white/50 mt-1">
                        المخزون: <span className="font-bold text-white font-sans">{p.stock}</span> قطعة
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStockChange(p.id, p.stock - 1)}
                        className="w-7 h-7 rounded bg-white/5 text-white flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-white font-sans">{p.stock}</span>
                      <button
                        onClick={() => handleStockChange(p.id, p.stock + 1)}
                        className="w-7 h-7 rounded bg-white/5 text-white flex items-center justify-center font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-white/80 hover:text-white"
                      >
                        {status === 'published' ? 'إخفاء' : 'إظهار'}
                      </button>
                      <button
                        onClick={() => onNavigate('edit-product', { productId: p.id })}
                        className="px-2.5 py-1 text-xs rounded-lg bg-[#c5a059]/20 text-[#c5a059] font-semibold"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => setDeleteModalProduct(p)}
                        className="p-1.5 text-red-400 rounded-lg bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete / Archive Confirmation Modal (Phase 13) */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151c18] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white">هل أنت متأكد من حذف أو أرشفة هذا المنتج؟</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                المنتج: <span className="font-semibold text-white">"{deleteModalProduct.name}"</span>
                <br />
                يوصى بـ <strong>الأرشفة</strong> للحفاظ على سجلات الطلبات السابقة للعملاء دون كسرها، بينما الحذف النهائي يمسحه تماماً.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleConfirmDelete(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Archive className="w-4 h-4" />
                <span>أرشفة وإخفاء (موصى به)</span>
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => handleConfirmDelete(true)}
                className="w-full py-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف نهائي</span>
              </button>
            </div>

            <button
              type="button"
              disabled={deleting}
              onClick={() => setDeleteModalProduct(null)}
              className="w-full py-2 text-xs text-white/50 hover:text-white transition-colors"
            >
              إلغاء الأمر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
