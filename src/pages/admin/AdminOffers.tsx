import React, { useEffect, useState } from 'react';
import { StoreService } from '../../services/storeService';
import type { Offer } from '../../types/admin';
import { Plus, Edit, Trash2, X, Sparkles, Calendar, Percent } from 'lucide-react';

export const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Form
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number | ''>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number | ''>(500);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [isActive, setIsActive] = useState(true);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await StoreService.getOffers();
      setOffers(data);
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const openAddModal = () => {
    setEditingOffer(null);
    setCode('');
    setTitle('');
    setDiscountPercent(10);
    setMinOrderAmount(500);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('2026-12-31');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (off: Offer) => {
    setEditingOffer(off);
    setCode(off.code);
    setTitle(off.title);
    setDiscountPercent(off.discountPercent);
    setMinOrderAmount(off.minOrderAmount ?? 0);
    setStartDate(off.startDate);
    setEndDate(off.endDate);
    setIsActive(off.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || discountPercent === '') return;

    const offerId = editingOffer ? editingOffer.id : `off-${Date.now()}`;
    await StoreService.saveOffer({
      id: offerId,
      code: code.trim().toUpperCase(),
      title: title.trim() || `خصم ${discountPercent}%`,
      discountPercent: Number(discountPercent),
      minOrderAmount: minOrderAmount !== '' ? Number(minOrderAmount) : 0,
      startDate,
      endDate,
      isActive,
      usageCount: editingOffer ? editingOffer.usageCount : 0,
    });

    showToast(editingOffer ? 'تم تحديث كوبون الخصم بنجاح' : 'تمت إضافة كود الخصم الجديد بنجاح');
    setModalOpen(false);
    loadOffers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
      await StoreService.deleteOffer(id);
      showToast('تم حذف الكوبون');
      loadOffers();
    }
  };

  const handleToggle = async (off: Offer) => {
    await StoreService.saveOffer({ ...off, isActive: !off.isActive });
    showToast(!off.isActive ? `تم تفعيل كوبون ${off.code}` : `تم إيقاف كوبون ${off.code}`);
    loadOffers();
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
          <h2 className="text-xl md:text-2xl font-bold font-amiri text-white">إدارة العروض وأكواد الخصم</h2>
          <p className="text-xs text-white/50">
            إنشاء وتفعيل كوبونات التخفيض، تحديد نسب الخصم وتواريخ الصلاحية
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#c5a059] to-[#dfba73] hover:opacity-95 text-[#0a0f0d] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 transition-transform active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ إنشاء كود خصم</span>
        </button>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="py-20 text-center text-white/50 space-y-3">
          <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">جاري تحميل العروض...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-[#111815] border border-white/10 rounded-2xl p-12 text-center text-white/50 text-xs">
          لا توجد أكواد خصم حالية. أضف كود خصم جديد لعملائك!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((off) => (
            <div
              key={off.id}
              className={`bg-[#111815] border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all ${
                off.isActive ? 'border-white/15' : 'border-white/5 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-3 py-1 rounded-lg">
                    {off.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      off.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {off.isActive ? 'ساري وفعال' : 'متوقف'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{off.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/70 mt-1">
                    <Percent className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>خصم بنسبة <strong className="text-white font-sans font-bold">{off.discountPercent}%</strong></span>
                  </div>
                  {off.minOrderAmount ? (
                    <p className="text-[10px] text-white/40 mt-0.5">
                      الحد الأدنى للطلب: {off.minOrderAmount} ر.س
                    </p>
                  ) : null}
                </div>

                <div className="text-[10px] text-white/40 space-y-0.5 pt-2 border-t border-white/5 font-sans">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-white/30" />
                    <span>الصلاحية: {off.startDate} إلى {off.endDate}</span>
                  </div>
                  <div>مرات الاستخدام: {off.usageCount} مرة</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                <button
                  onClick={() => handleToggle(off)}
                  className={`text-xs ${off.isActive ? 'text-amber-400/80 hover:underline' : 'text-emerald-400 hover:underline'}`}
                >
                  {off.isActive ? 'إيقاف مؤقت' : 'تفعيل الكوبون'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(off)}
                    className="p-1.5 text-white/70 hover:text-white rounded-lg bg-white/5"
                    title="تعديل"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(off.id)}
                    className="p-1.5 text-red-400/70 hover:text-red-300 rounded-lg bg-red-500/10"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151c18] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-amiri">
                {editingOffer ? 'تعديل كود الخصم' : 'إنشاء كود خصم جديد'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-white/70 mb-1 font-medium">رمز الكوبون (الكود)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="مثال: SUMMER2026"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2 text-white font-mono uppercase focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-medium">عنوان العرض الترويجي</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: خصم افتتاح التشكيلة الصيفية"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-medium">نسبة الخصم %</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2 text-white font-sans focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 font-medium">الحد الأدنى للطلب (ر.س)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2 text-white font-sans focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-medium">تاريخ البداية</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2 text-white font-sans focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 font-medium">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-3.5 py-2 text-white font-sans focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#c5a059] rounded"
                  />
                  <span className="text-white font-medium">تفعيل الكوبون فوراً في المتجر</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-white/60 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#c5a059] to-[#dfba73] text-[#0a0f0d] font-bold px-6 py-2 rounded-xl"
                >
                  حفظ الكوبون
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
