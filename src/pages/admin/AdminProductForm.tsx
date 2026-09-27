import React, { useState, useEffect } from 'react';
import { StoreService } from '../../services/storeService';
import type { Category, ProductColor, ProductStatus } from '../../types/product';
import type { AdminTab } from '../../components/admin/AdminLayout';
import {
  ArrowRight,
  Upload,
  X,
  Plus,
  Star,
  Sparkles,
  Flame,
  TrendingUp,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Save,
} from 'lucide-react';

interface AdminProductFormProps {
  productId?: string;
  onNavigate: (tab: AdminTab) => void;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ productId, onNavigate }) => {
  const isEditing = Boolean(productId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('dresses');
  const [price, setPrice] = useState<number | ''>(1500);
  const [oldPrice, setOldPrice] = useState<number | ''>('');
  const [discount, setDiscount] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>(10);
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('حرير ساتان طبيعي فاخر 100%');
  const [care, setCare] = useState('تنظيف جاف فقط (Dry Clean Only)');
  const [status, setStatus] = useState<ProductStatus>('published');
  const [season, setSeason] = useState('2026');

  // Booleans
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [bestSeller, setBestSeller] = useState(false);
  const [trending, setTrending] = useState(false);

  // Sizes & Colors
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState<ProductColor[]>([
    { name: 'زمردي ملكي', hex: '#113324' },
    { name: 'أسود كلاسيك', hex: '#111111' },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#c5a059');

  // Images
  const [images, setImages] = useState<string[]>(['/hero-frames/frame_240.webp']);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const cats = await StoreService.getCategories();
        setCategories(cats);

        if (productId) {
          const prod = await StoreService.getProductById(productId);
          if (prod) {
            setName(prod.name);
            setNameEn(prod.nameEn);
            setCategory(prod.category);
            setPrice(prod.price);
            setOldPrice(prod.oldPrice ?? '');
            setDiscount(prod.discount ?? '');
            setStock(prod.stock);
            setDescription(prod.description);
            setFabric(prod.fabric);
            setCare(prod.care);
            setStatus(prod.status || 'published');
            setSeason(prod.season || '2026');
            setFeatured(Boolean(prod.featured));
            setNewArrival(Boolean(prod.newArrival));
            setBestSeller(Boolean(prod.bestSeller));
            setTrending(Boolean(prod.trending));
            setSizes(prod.sizes || ['S', 'M', 'L']);
            setColors(prod.colors || []);
            setImages(prod.images || ['/hero-frames/frame_240.webp']);
          }
        }
      } catch (err) {
        console.error('Failed to initialize form:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [productId]);

  // Size toggle
  const toggleSize = (sz: string) => {
    if (sizes.includes(sz)) {
      if (sizes.length > 1) {
        setSizes(sizes.filter((s) => s !== sz));
      }
    } else {
      setSizes([...sizes, sz]);
    }
  };

  // Add Color
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  // Remove Color
  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // Image Upload File Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const uploadedUrl = await StoreService.uploadImage(file);
      setImages((prev) => [...prev, uploadedUrl]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل رفع ملف الصورة';
      setError(msg);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Add Direct URL Image
  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setImages((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      setError('يجب الإبقاء على صورة واحدة على الأقل للمنتج');
      return;
    }
    setImages(images.filter((_, i) => i !== index));
  };

  // Set Primary Image (Move to 0)
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([target, ...rest]);
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى كتابة اسم المنتج');
      return;
    }
    if (price === '' || price < 0) {
      setError('يرجى تحديد سعر صالح للمنتج');
      return;
    }
    if (images.length === 0) {
      setError('يرجى إضافة صورة واحدة على الأقل للمنتج');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await StoreService.saveProduct({
        id: productId,
        name: name.trim(),
        nameEn: nameEn.trim() || name.trim(),
        category,
        price: Number(price),
        oldPrice: oldPrice !== '' ? Number(oldPrice) : undefined,
        discount: discount !== '' ? Number(discount) : undefined,
        stock: stock !== '' ? Number(stock) : 10,
        description: description.trim(),
        fabric: fabric.trim(),
        care: care.trim(),
        status,
        season,
        featured,
        newArrival,
        bestSeller,
        trending,
        sizes,
        colors,
        images,
      });

      setSuccess(true);
      setTimeout(() => {
        onNavigate('products');
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ المنتج';
      setError(msg);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-white/50 space-y-3">
        <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">جاري تحميل بيانات المنتج...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('products')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
            title="رجوع للمنتجات"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-amiri text-white">
              {isEditing ? `تعديل المنتج: ${name}` : 'إضافة منتج جديد للمتجر'}
            </h2>
            <p className="text-xs text-white/50">
              سيظهر هذا المنتج مباشرة في متجر مؤمن سنتر بمجرد الحفظ والنشر
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-gradient-to-r from-[#c5a059] to-[#dfba73] hover:opacity-95 text-[#0a0f0d] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 transition-transform active:scale-98 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-[#0a0f0d] border-t-transparent rounded-full animate-spin" />
          ) : success ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>تم الحفظ بنجاح!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'حفظ التعديلات' : 'نشر المنتج الآن'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Core Info, Descriptions, Sizes, Colors */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Basic Info */}
          <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-amiri border-b border-white/10 pb-3">
              المعلومات الأساسية
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/70 mb-1.5 font-medium">
                  اسم المنتج (بالعربية) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: فستان الزمرد الحريري الملكي"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1.5 font-medium">
                  اسم المنتج بالإنجليزية (English)
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Royal Emerald Silk Gown"
                  dir="ltr"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/70 mb-1.5 font-medium">
                  التصنيف الرئيسي <span className="text-red-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#16201b] border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1.5 font-medium">
                  الموسم / التشكيلة
                </label>
                <input
                  type="text"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  placeholder="مثال: ربيع وصيف 2026"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1.5 font-medium">
                وصف الفستان والتفاصيل الجمالية
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتبي وصفاً جذاباً يبرز خامة الفستان، قصة الأكمام، والحضور الملكي..."
                className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none transition-all leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/70 mb-1.5 font-medium">
                  خامة وتكوين القماش
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="مثال: حرير ساتان إيطالي 100%"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1.5 font-medium">
                  تعليمات العناية والغسيل
                </label>
                <input
                  type="text"
                  value={care}
                  onChange={(e) => setCare(e.target.value)}
                  placeholder="مثال: تنظيف جاف فقط (Dry Clean Only)"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section: Sizes and Colors */}
          <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-amiri border-b border-white/10 pb-3">
              المقاسات والألوان المتاحة
            </h3>

            {/* Sizes */}
            <div>
              <label className="block text-xs text-white/70 mb-2 font-medium">
                المقاسات المتوفرة:
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((sz) => {
                  const isSelected = sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
                        isSelected
                          ? 'bg-[#c5a059] text-[#0a0f0d] shadow-sm'
                          : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div className="pt-2">
              <label className="block text-xs text-white/70 mb-2 font-medium">
                الألوان المتاحة:
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {colors.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="text-white/40 hover:text-red-400 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Color */}
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="اسم اللون (مثال: عاجي لؤلؤي)"
                  className="flex-1 bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none"
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  title="اختر درجة اللون"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>إضافة لون</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section: Image Gallery & Upload (Phase 12) */}
          <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-amiri">معرض صور الفستان</h3>
                <p className="text-[11px] text-white/50">الصورة الأولى هي الصورة الرئيسية التي تظهر في المتجر</p>
              </div>
              <span className="text-xs text-[#c5a059] font-sans">{images.length} صور</span>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`group relative rounded-xl overflow-hidden aspect-[3/4] bg-black border ${
                    idx === 0 ? 'border-[#c5a059] ring-2 ring-[#c5a059]/30' : 'border-white/10'
                  }`}
                >
                  <img src={img} alt="Product" className="w-full h-full object-cover" />

                  {/* Primary Badge */}
                  {idx === 0 && (
                    <span className="absolute top-2 right-2 bg-[#c5a059] text-[#0a0f0d] text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                      الرئيسية
                    </span>
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md"
                      >
                        تعيين كرئيسية
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-md bg-red-500/30 text-red-200 hover:bg-red-500/50"
                      title="حذف الصورة"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload Drop Area */}
              <label className="border-2 border-dashed border-white/15 hover:border-[#c5a059]/50 rounded-xl aspect-[3/4] flex flex-col items-center justify-center cursor-pointer transition-colors p-3 text-center bg-white/[0.02]">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploadingImage ? (
                  <div className="w-6 h-6 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-[#c5a059] mb-1.5" />
                    <span className="text-[11px] font-medium text-white">رفع صورة جديدة</span>
                    <span className="text-[9px] text-white/40 mt-1">JPG, PNG, WebP (أقل من 5MB)</span>
                  </>
                )}
              </label>
            </div>

            {/* Direct Image URL input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="أو أضف رابط صورة مباشر (https://...)"
                dir="ltr"
                className="flex-1 bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>إضافة الرابط</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Pricing, Stock, Status, Product Badges */}
        <div className="space-y-6">
          {/* Pricing & Stock */}
          <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-amiri border-b border-white/10 pb-3">
              السعر والمخزون
            </h3>

            <div>
              <label className="block text-xs text-white/70 mb-1.5 font-medium">
                السعر الحالي (بالريال السعودي) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="3850"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 pl-12 text-sm font-bold font-sans text-white focus:outline-none"
                  dir="ltr"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40">
                  ر.س
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1.5 font-medium">
                السعر قبل الخصم (اختياري)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="4500"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 pl-12 text-xs font-sans text-white/70 focus:outline-none"
                  dir="ltr"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40">
                  ر.س
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1.5 font-medium">
                نسبة الخصم % (اختياري)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={discount}
                onChange={(e) => setDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="مثال: 15"
                className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs font-sans text-white focus:outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1.5 font-medium">
                الكمية في المخزون <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="10"
                className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs font-sans text-white focus:outline-none"
                dir="ltr"
              />
              <span className="text-[10px] text-white/40 mt-1 block">
                {Number(stock) === 0 ? '⚠️ سيظهر كـ نفد المخزون' : Number(stock) <= 5 ? '⚠️ سيظهر تنبيه مخزون منخفض' : '✓ متوفر بشكل كافٍ'}
              </span>
            </div>
          </div>

          {/* Visibility & Status (Phase 14) */}
          <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-amiri border-b border-white/10 pb-3">
              حالة النشر والظهور
            </h3>

            <div className="space-y-2">
              {[
                { id: 'published', label: 'معروض (Published)', desc: 'يظهر للعملاء في المتجر فوراً ويمكن شراؤه' },
                { id: 'hidden', label: 'مخفي (Hidden)', desc: 'مخفي عن واجهة المتجر ويمكن استعادته لاحقاً' },
                { id: 'draft', label: 'مسودة (Draft)', desc: 'قيد التجهيز من قبل الإدارة' },
                { id: 'archived', label: 'مؤرشف (Archived)', desc: 'تم إيقافه مع الحفاظ على طلبات الشراء السابقة' },
              ].map((st) => (
                <label
                  key={st.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    status === st.id
                      ? 'bg-[#c5a059]/10 border-[#c5a059] text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={st.id}
                    checked={status === st.id}
                    onChange={() => setStatus(st.id as ProductStatus)}
                    className="mt-0.5 accent-[#c5a059]"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{st.label}</p>
                    <p className="text-[10px] text-white/50">{st.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Marketing Badges */}
          <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-amiri border-b border-white/10 pb-3">
              شارات تسويقية في المتجر
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                <span className="flex items-center gap-2 text-xs text-white">
                  <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  <span>وصل حديثاً (New Arrival)</span>
                </span>
                <input
                  type="checkbox"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                  className="w-4 h-4 accent-[#c5a059] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                <span className="flex items-center gap-2 text-xs text-white">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>الأكثر مبيعاً (Best Seller)</span>
                </span>
                <input
                  type="checkbox"
                  checked={bestSeller}
                  onChange={(e) => setBestSeller(e.target.checked)}
                  className="w-4 h-4 accent-[#c5a059] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                <span className="flex items-center gap-2 text-xs text-white">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span>تشكيلة مميزة (Featured)</span>
                </span>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#c5a059] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                <span className="flex items-center gap-2 text-xs text-white">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>رائج الآن (Trending)</span>
                </span>
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(e) => setTrending(e.target.checked)}
                  className="w-4 h-4 accent-[#c5a059] rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
