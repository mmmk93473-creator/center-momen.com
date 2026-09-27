import React, { useEffect, useState } from 'react';
import { StoreService } from '../../services/storeService';
import type { HomepageSettings } from '../../types/admin';
import {
  LayoutTemplate,
  Save,
  Check,
  Sparkles,
  Megaphone,
} from 'lucide-react';

export const AdminHomepage: React.FC = () => {
  const [settings, setSettings] = useState<HomepageSettings>({
    heroBadge: 'تشكيلة صيف وخريف 2026 الحصرية',
    heroTitle: 'فخامة لا تشبه إلا حضورك الملكي',
    heroSubtitle: 'دار أزياء نسائية سعودية رفيعة المستوى، تصاميم هوت كوتور تنسدل بأنوثة حالمة وأقمشة حريرية إيطالية نادرة.',
    heroCtaText: 'اكتشفي المجموعة الفاخرة',
    announcementText: 'توصيل مجاني لجميع مناطق المملكة للطلبات فوق 500 ريال | هدايا حصرية مع كل طلب',
    announcementActive: true,
    featuredCategoryIds: ['dresses', 'blouses', 'jackets', 'accessories'],
    showTrendingSection: true,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const data = await StoreService.getHomepageSettings();
      if (data) setSettings(data);
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await StoreService.saveHomepageSettings(settings);
      setSaved(true);
      setToast('تم حفظ إعدادات واجهة المتجر بنجاح!');
      setTimeout(() => {
        setSaved(false);
        setToast(null);
      }, 3500);
    } catch (err) {
      console.error('Failed to save homepage settings:', err);
    } finally {
      setSaving(false);
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
          <h2 className="text-xl md:text-2xl font-bold font-amiri text-white">إدارة نصوص وواجهة المتجر</h2>
          <p className="text-xs text-white/50">
            تخصيص عبارات الهيرو والبانر الترويجي دون المساس بمحرك الرسوم السينمائي الفاخر (300 Frame Scroll)
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-[#c5a059] to-[#dfba73] hover:opacity-95 text-[#0a0f0d] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 transition-transform active:scale-98 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-[#0a0f0d] border-t-transparent rounded-full animate-spin" />
          ) : saved ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>تم الحفظ!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>حفظ الإعدادات</span>
            </>
          )}
        </button>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-start gap-3 text-xs text-[#c5a059]">
        <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>محرك المشهد السينمائي نشط:</strong> يمكنك تعديل العناوين والشارات والنصوص التسويقية هنا، بينما يحتفظ المتجر تلقائياً بتجربة التمرير التفاعلية ومحرك فريمات الكانفاس فائق السلاسة.
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section Copy */}
        <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <LayoutTemplate className="w-4 h-4 text-[#c5a059]" />
            <h3 className="text-sm font-bold text-white font-amiri">القسم الرئيسي (Cinematic Hero)</h3>
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1.5 font-medium">شارة الترحيب العلوية</label>
            <input
              type="text"
              value={settings.heroBadge}
              onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
              className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1.5 font-medium">العنوان الرئيسي الفخم</label>
            <input
              type="text"
              value={settings.heroTitle}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white font-amiri text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1.5 font-medium">النص التعريفي الشاعري</label>
            <textarea
              rows={3}
              value={settings.heroSubtitle}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1.5 font-medium">نص زر التصفح الرئيسي (CTA)</label>
            <input
              type="text"
              value={settings.heroCtaText}
              onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
              className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Announcement Bar & Sections */}
        <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Megaphone className="w-4 h-4 text-[#c5a059]" />
            <h3 className="text-sm font-bold text-white font-amiri">شريط الإعلانات والأقسام الإضافية</h3>
          </div>

          <div>
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer mb-3">
              <div>
                <span className="text-xs font-bold text-white block">تفعيل شريط الإعلانات العلوي</span>
                <span className="text-[10px] text-white/50">يظهر في أعلى كل صفحات المتجر</span>
              </div>
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="w-4 h-4 accent-[#c5a059] rounded"
              />
            </label>

            <label className="block text-xs text-white/70 mb-1.5 font-medium">نص الإعلان أو العرض الخاص</label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-white/5">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">إظهار قسم "الأكثر رواجاً والتريند"</span>
                <span className="text-[10px] text-white/50">يعرض المنتجات المميزة في الصفحة الرئيسية</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showTrendingSection}
                onChange={(e) => setSettings({ ...settings, showTrendingSection: e.target.checked })}
                className="w-4 h-4 accent-[#c5a059] rounded"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
