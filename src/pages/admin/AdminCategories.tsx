import React, { useEffect, useState } from 'react';
import { StoreService, storeEvents } from '../../services/storeService';
import type { Category } from '../../types/product';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  Sparkles,
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'active' | 'hidden'>('active');

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const cats = await StoreService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    return storeEvents.subscribe(() => {
      loadCategories();
    });
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setId('');
    setName('');
    setNameEn('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop');
    setStatus('active');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setId(cat.id);
    setName(cat.name);
    setNameEn(cat.nameEn);
    setDescription(cat.description);
    setImage(cat.image);
    setStatus(cat.status || 'active');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const categoryId = editingCategory ? editingCategory.id : (id.trim().toLowerCase().replace(/\s+/g, '-') || `cat-${Date.now()}`);
      await StoreService.saveCategory({
        id: categoryId,
        name: name.trim(),
        nameEn: nameEn.trim() || name.trim(),
        description: description.trim(),
        image: image.trim() || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop',
        count: editingCategory ? editingCategory.count : 0,
        status,
      });

      showToast(editingCategory ? 'تم تحديث التصنيف بنجاح' : 'تمت إضافة التصنيف الجديد بنجاح');
      setModalOpen(false);
    } catch (err) {
      console.error('Save category error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    const nextStatus = cat.status === 'hidden' ? 'active' : 'hidden';
    await StoreService.saveCategory({ ...cat, status: nextStatus });
    showToast(nextStatus === 'active' ? `تم تفعيل تصنيف ${cat.name}` : `تم إخفاء تصنيف ${cat.name}`);
  };

  const handleDelete = async (catId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      await StoreService.deleteCategory(catId);
      showToast('تم حذف التصنيف بنجاح');
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-amiri text-white">إدارة تصنيفات المتجر</h2>
          <p className="text-xs text-white/50">
            تخصيص الأقسام الرئيسية للأزياء النسائية (فساتين، بلوزات، بناطيل، جاكيتات، إكسسوارات)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#c5a059] to-[#dfba73] hover:opacity-95 text-[#0a0f0d] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 transition-transform active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ إضافة تصنيف جديد</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-20 text-center text-white/50 space-y-3">
          <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">جاري تحميل التصنيفات...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const isHidden = cat.status === 'hidden';
            return (
              <div
                key={cat.id}
                className={`bg-[#111815] border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                  isHidden ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Category Image Cover */}
                <div className="relative h-44 bg-black overflow-hidden group">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111815] via-black/40 to-transparent" />

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${
                      isHidden
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {isHidden ? 'مخفي عن الواجهة' : 'نشط ومعروض'}
                  </span>

                  {/* Product Count */}
                  <span className="absolute bottom-3 right-3 text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                    {cat.count} منتج
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="text-base font-bold text-white font-amiri">{cat.name}</h3>
                      <span className="text-xs text-white/40 font-sans">{cat.nameEn}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                      {cat.description || 'لا يوجد وصف مضاف لهذا القسم.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      className={`text-xs flex items-center gap-1.5 transition-colors ${
                        isHidden ? 'text-emerald-400 hover:underline' : 'text-amber-400/80 hover:underline'
                      }`}
                    >
                      {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{isHidden ? 'إظهار في المتجر' : 'إخفاء مؤقت'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 text-white/70 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        title="تعديل التصنيف"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-red-400/70 hover:text-red-300 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        title="حذف التصنيف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151c18] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-amiri">
                {editingCategory ? `تعديل تصنيف: ${editingCategory.name}` : 'إضافة تصنيف أزياء جديد'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/40 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {!editingCategory && (
                <div>
                  <label className="block text-white/70 mb-1 font-medium">
                    معرف التصنيف الإنجليزي (ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="e.g. evening-gowns, kaftans"
                    dir="ltr"
                    className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-medium">اسم التصنيف بالعربية</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: فساتين السهرة"
                    className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 font-medium">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Evening Gowns"
                    dir="ltr"
                    className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-medium">وصف القسم</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف مختصر للتشكيلة والقصات المتوفرة..."
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl p-3 text-white placeholder-white/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-medium">رابط صورة الغلاف</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-medium">حالة الظهور</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#16201b] border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                >
                  <option value="active">نشط ومعروض في المتجر (Active)</option>
                  <option value="hidden">مخفي مؤقتاً (Hidden)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-[#c5a059] to-[#dfba73] hover:opacity-95 text-[#0a0f0d] font-bold px-6 py-2 rounded-xl transition-all"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ التصنيف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
