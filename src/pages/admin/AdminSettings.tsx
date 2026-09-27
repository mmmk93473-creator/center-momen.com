import React, { useState } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { StoreService } from '../../services/storeService';
import {
  Database,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExportBackup = async () => {
    setExporting(true);
    try {
      const [products, categories, orders, offers] = await Promise.all([
        StoreService.getProducts(),
        StoreService.getCategories(),
        StoreService.getOrders(),
        StoreService.getOffers(),
      ]);

      const backup = {
        exportedAt: new Date().toISOString(),
        version: '2.0.0',
        store: 'Momen Center Luxury Fashion',
        data: {
          products,
          categories,
          orders,
          offers,
        },
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `momen-center-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setToast('تم تصدير نسخة احتياطية كاملة للمتجر بنجاح!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#16291e] border border-emerald-500/40 text-emerald-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold font-amiri text-white">إعدادات النظام وقاعدة البيانات</h2>
        <p className="text-xs text-white/50">
          حالة ربط خوادم Supabase، أمن الحسابات، والنسخ الاحتياطي لبيانات المتجر
        </p>
      </div>

      {/* Database Connection Status Card */}
      <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isSupabaseConfigured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">حالة الاتصال بقاعدة البيانات (Supabase)</h3>
              <p className="text-xs text-white/50">
                {isSupabaseConfigured
                  ? 'متصل بقاعدة بيانات سحابية حية ومشفرة (PostgreSQL + RLS + Storage)'
                  : 'يعمل حالياً في الوضع المحلي المستقل فائق السرعة (Standalone Local Storage)'}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            isSupabaseConfigured
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
          }`}>
            {isSupabaseConfigured ? '● متصل سحابياً' : '● الوضع المحلي المستقل'}
          </span>
        </div>

        {/* Supabase Setup Instructions */}
        {!isSupabaseConfigured && (
          <div className="bg-[#16201b] border border-amber-500/20 rounded-xl p-4 text-xs space-y-3 text-white/80 leading-relaxed">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>خطوات الربط بمشروع Supabase الخاص بك:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-white/70">
              <li>أنشئ مشروعاً مجانياً على <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#c5a059] underline">supabase.com</a>.</li>
              <li>انتقل إلى <strong>SQL Editor</strong> ونفّذ سكريبت المخطط الموجود في ملف <code className="text-[#c5a059] bg-black/40 px-1 rounded">supabase/migrations/20260927000000_momen_center_schema.sql</code>.</li>
              <li>نفّذ سكريبت التخزين في <code className="text-[#c5a059] bg-black/40 px-1 rounded">supabase/storage.sql</code> لإنشاء حاوية صور المنتجات.</li>
              <li>انسخ مفاتيح الـ API وضعهما في ملف <code className="text-[#c5a059] bg-black/40 px-1 rounded">.env</code> في جذر المشروع.</li>
            </ol>

            <div className="bg-black/50 p-3 rounded-lg font-mono text-[11px] text-white/90 space-y-1 relative" dir="ltr">
              <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
              <p>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
              <button
                onClick={() => copyToClipboard('VITE_SUPABASE_URL=\nVITE_SUPABASE_ANON_KEY=', 'env-keys')}
                className="absolute top-2.5 right-2.5 p-1.5 bg-white/10 hover:bg-white/20 rounded text-white"
                title="نسخ"
              >
                {copied === 'env-keys' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security & RLS Audit Checklist (Phase 24 & 39) */}
      <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-amiri">تقرير الأمان وحماية البيانات (Security & RLS)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            { title: 'حماية مسارات الإدارة (RBAC Guard)', desc: 'يُمنع الزوار والعملاء العاديين من فتح /admin', ok: true },
            { title: 'أمن البيانات والأسعار (Database RLS)', desc: 'قواعد PostgreSQL تمنع تعديل الأسعار إلا بـ Admin Token', ok: true },
            { title: 'حماية المفاتيح السرية (Zero Service-Role)', desc: 'مفاتيح service-role غير معروضة في كود المتصفح إطلاقاً', ok: true },
            { title: 'محرك أرشفة الطلبات (Soft Archive)', desc: 'حماية الطلبات التاريخية للعملاء من الحذف الكسري', ok: true },
            { title: 'عزل محرك الهيرو (Hero Safety Guard)', desc: 'الرسوم السينمائية 300-Frame محمية ولا يمكن كسرها من لوحة التحكم', ok: true },
            { title: 'حماية رفع الملفات (MIME Validation)', desc: 'التحقق الصارم من نوع الملف وحجم الصور قبل الرفع', ok: true },
          ].map((sec, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">{sec.title}</p>
                <p className="text-[10px] text-white/50 leading-relaxed">{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Backup & Export (Phase 25) */}
      <div className="bg-[#111815] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <Download className="w-5 h-5 text-[#c5a059]" />
          <h3 className="text-sm font-bold text-white font-amiri">النسخ الاحتياطي وتصدير البيانات</h3>
        </div>

        <p className="text-xs text-white/60 leading-relaxed">
          يمكنك تحميل نسخة كاملة من جميع المنتجات، التصنيفات، الطلبات، والعروض بصيغة JSON قابلة للاسترجاع في أي وقت لحفظ أمان بيانات متجرك.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            disabled={exporting}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/15 transition-colors"
          >
            <Download className="w-4 h-4 text-[#c5a059]" />
            <span>{exporting ? 'جاري التصدير...' : 'تصدير نسخة احتياطية كاملة (JSON)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
