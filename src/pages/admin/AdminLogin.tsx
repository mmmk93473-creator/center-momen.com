import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToStore }) => {
  const { login, loading, error, clearError } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const res = await login(email, password);
    if (res.success) {
      onSuccess();
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@momencenter.com');
    setPassword('admin123456');
    clearError();
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f0d] text-white flex flex-col justify-between relative overflow-hidden font-alexandria" dir="rtl">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#16382b]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 md:p-8 flex items-center justify-between relative z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] font-playfair font-bold text-lg">
            M
          </div>
          <div>
            <h1 className="font-playfair font-bold text-lg md:text-xl tracking-wider text-white">MOMEN CENTER</h1>
            <p className="text-[11px] text-[#c5a059] tracking-widest font-sans">ADMIN CONTROL PORTAL</p>
          </div>
        </div>

        <button
          onClick={onBackToStore}
          className="flex items-center gap-2 text-xs md:text-sm text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
        >
          <span>العودة للمتجر</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-[#111815]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-amiri text-white mb-2">تسجيل دخول الإدارة</h2>
            <p className="text-sm text-white/60">
              لوحة التحكم الخاصة بمالك وإدارة متجر مؤمن سنتر
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-2">
                البريد الإلكتروني للإدارة
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="admin@momencenter.com"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#c5a059] transition-all"
                  dir="ltr"
                />
                <Mail className="w-5 h-5 text-white/40 absolute top-1/2 -translate-y-1/2 right-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/80 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#c5a059] rounded-xl px-4 py-3.5 pr-11 pl-11 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#c5a059] transition-all"
                  dir="ltr"
                />
                <Lock className="w-5 h-5 text-white/40 absolute top-1/2 -translate-y-1/2 right-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 left-3.5 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#c5a059] via-[#dfba73] to-[#c5a059] hover:opacity-95 text-[#0a0f0d] font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-[#c5a059]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0a0f0d] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <Lock className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          {!isSupabaseConfigured && (
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/50 mb-2">حساب تجريبي سريع للمعاينة المحلية:</p>
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1.5 text-xs text-[#c5a059] hover:underline bg-[#c5a059]/10 px-3 py-1.5 rounded-lg border border-[#c5a059]/30 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>تعبئة بيانات حساب المدير (admin@momencenter.com)</span>
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-white/40">
            {isSupabaseConfigured ? (
              <span className="text-emerald-400/80">● متصل بنظام المصادقة المشفر (Supabase Auth)</span>
            ) : (
              <span className="text-[#c5a059]/80">● وضع المعاينة المحلية المشفر (Standalone RBAC)</span>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-white/30 border-t border-white/5 relative z-10">
        © 2026 MOMEN CENTER — جميع الحقوق محفوظة لدار مؤمن سنتر للأزياء الراقية
      </footer>
    </div>
  );
};
