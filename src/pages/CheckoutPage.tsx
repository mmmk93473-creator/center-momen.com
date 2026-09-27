import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { CheckoutFormData } from '../types/cart';
import { SEOHead } from '../components/common/SEOHead';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  PhoneCall,
  Sparkles,
  CreditCard
} from 'lucide-react';

const EGYPT_GOVERNORATES = [
  'القاهرة (Cairo)',
  'الجيزة (Giza)',
  'الإسكندرية (Alexandria)',
  'القليوبية (Qalyubia)',
  'الدقهلية (Dakahlia)',
  'الشرقية (Sharqia)',
  'المنوفية (Monufia)',
  'الغربية (Gharbia)',
  'كفر الشيخ (Kafr El Sheikh)',
  'البحيرة (Beheira)',
  'دمياط (Damietta)',
  'بورسعيد (Port Said)',
  'الإسماعيلية (Ismailia)',
  'السويس (Suez)',
  'بني سويف (Beni Suef)',
  'الفيوم (Faiyum)',
  'المنيا (Minya)',
  'أسيوط (Asyut)',
  'سوهاج (Sohag)',
  'قنا (Qena)',
  'الأقصر (Luxor)',
  'أسوان (Aswan)',
  'البحر الأحمر (Red Sea)',
  'جنوب سيناء (South Sinai)',
  'شمال سيناء (North Sinai)',
  'مطروح (Matrouh)',
  'الوادي الجديد (New Valley)'
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, freeShippingThreshold, createOrder, navigateTo, formatPrice, addToast } = useStore();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    governorate: 'القاهرة (Cairo)',
    city: '',
    address: '',
    notes: '',
    paymentMethod: 'cod'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : 80;
  const grandTotal = cartSubtotal + shippingFee;

  // Validation
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errors.fullName = 'يرجى إدخال الاسم الثلاثي بالكامل';
    }

    const cleanPhone = formData.phone.trim().replace(/\s+/g, '');
    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      errors.phone = 'يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678)';
    }

    if (!formData.city.trim()) {
      errors.city = 'يرجى إدخال الحي أو المدينة';
    }

    if (!formData.address.trim() || formData.address.trim().length < 6) {
      errors.address = 'يرجى إدخال العنوان التفصيلي (الشارع، رقم العمارة، الشقة)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast('سلة التسوق فارغة', 'يرجى إضافة منتجات أولاً', 'info');
      navigateTo('shop');
      return;
    }

    if (!validate()) {
      addToast('يرجى استكمال البيانات المطلوبة', 'تحققي من الحقول المشار إليها باللون الأحمر', 'info');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder(formData);
      setCompletedOrder(order);
      setIsSubmitting(false);

      // Trigger celebratory luxury confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#fdf0b0', '#113324', '#2ec4b6']
        });
      } catch (err) {}
    }, 1200);
  };

  if (completedOrder) {
    return (
      <div style={{ backgroundColor: '#071b13', minHeight: '100vh', padding: '4rem 1.5rem' }}>
        <SEOHead title="تم تأكيد طلبك بنجاح" />
        <div
          style={{
            maxWidth: '650px',
            margin: '0 auto',
            background: 'rgba(17, 51, 36, 0.6)',
            border: '2px solid var(--gold-500)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.25)'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '2px solid var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              color: 'var(--gold-300)'
            }}
          >
            <CheckCircle2 size={44} />
          </div>

          <span className="badge-gold" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>طلب مؤكد بنجاح — شكراً لثقتكِ</span>
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            تهانينا يا {completedOrder.customer.fullName}
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
            تم تسجيل طلبكِ رقم <strong className="font-editorial text-gold-300" style={{ fontSize: '1.2rem' }}>#{completedOrder.id}</strong> في نظام مؤمن سنتر. سيتواصل معكِ مندوب التوصيل لتأكيد موعد التسليم والمعاينة.
          </p>

          {/* Order Details Card */}
          <div
            style={{
              background: 'rgba(7, 27, 19, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'right',
              marginBottom: '2rem'
            }}
          >
            <h4 style={{ fontSize: '1rem', color: 'var(--gold-300)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              تفاصيل التوصيل:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>المحافظة والمدينة: </span>
                <strong style={{ color: '#ffffff' }}>{completedOrder.customer.governorate} — {completedOrder.customer.city}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>العنوان: </span>
                <strong style={{ color: '#ffffff' }}>{completedOrder.customer.address}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>رقم الهاتف: </span>
                <strong style={{ color: '#ffffff' }}>{completedOrder.customer.phone}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>طريقة الدفع: </span>
                <strong style={{ color: 'var(--gold-200)' }}>الدفع عند الاستلام (معاينة قبل السداد)</strong>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>المبلغ المطلوب عند الاستلام:</span>
              <span className="font-editorial text-gold-300" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                {formatPrice(completedOrder.total)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigateTo('home')} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
              <span>العودة للرئيسية</span>
            </button>
            <a
              href={`https://wa.me/201000000000?text=${encodeURIComponent(`مرحباً مؤمن سنتر، أود الاستفسار عن طلبي رقم #${completedOrder.id}`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem' }}
            >
              <PhoneCall size={16} />
              <span>متابعة الطلب عبر واتساب</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#071b13', minHeight: '100vh', padding: '2rem 0 5rem 0' }}>
      <SEOHead title="إتمام الطلب والدفع" description="أدخلي بيانات الشحن لتوصيل أزياء مؤمن سنتر إلى باب منزلك مع خيار الدفع عند الاستلام." />

      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div className="section-tag">
            <span>خطوة الدفع الآمن</span>
          </div>
          <h1 className="section-title">
            إتمام <span className="text-gold-gradient">الطلب</span>
          </h1>
          <p className="section-subtitle">
            أدخلي بيانات الشحن والتوصيل. لا يلزم إدخال بطاقة بنكية — الدفع نقداً عند استلام ومعاينة الشحنة.
          </p>
        </div>

        {/* Form and Summary Split Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '2.5rem',
            alignItems: 'start'
          }}
          className="checkout-grid"
        >
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'rgba(17, 51, 36, 0.45)',
              border: '1.5px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} color="var(--gold-400)" />
              <span>1. بيانات الشحن والتوصيل</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--gold-300)', marginBottom: '0.4rem' }}>
                  الاسم الثلاثي بالكامل *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="مثال: ياسمين أحمد محمود"
                  style={{
                    width: '100%',
                    background: 'rgba(7, 27, 19, 0.8)',
                    border: formErrors.fullName ? '1.5px solid var(--color-danger)' : '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                {formErrors.fullName && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-danger)', marginTop: '0.25rem', display: 'block' }}>
                    {formErrors.fullName}
                  </span>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--gold-300)', marginBottom: '0.4rem' }}>
                  رقم الهاتف للتواصل (مصر) *
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01012345678"
                  style={{
                    width: '100%',
                    background: 'rgba(7, 27, 19, 0.8)',
                    border: formErrors.phone ? '1.5px solid var(--color-danger)' : '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    outline: 'none',
                    textAlign: 'right'
                  }}
                />
                {formErrors.phone && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-danger)', marginTop: '0.25rem', display: 'block' }}>
                    {formErrors.phone}
                  </span>
                )}
              </div>

              {/* Governorate & City */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--gold-300)', marginBottom: '0.4rem' }}>
                    المحافظة *
                  </label>
                  <select
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(7, 27, 19, 0.8)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '0.9rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov} style={{ background: '#071b13' }}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--gold-300)', marginBottom: '0.4rem' }}>
                    المدينة / الحي *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="مثال: المعادي / التجمع الخامس"
                    style={{
                      width: '100%',
                      background: 'rgba(7, 27, 19, 0.8)',
                      border: formErrors.city ? '1.5px solid var(--color-danger)' : '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                  {formErrors.city && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-danger)', marginTop: '0.25rem', display: 'block' }}>
                      {formErrors.city}
                    </span>
                  )}
                </div>
              </div>

              {/* Detailed Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--gold-300)', marginBottom: '0.4rem' }}>
                  العنوان التفصيلي بالتفصيل *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="الشارع، رقم العمارة، رقم الشقة أو علامة مميزة..."
                  style={{
                    width: '100%',
                    background: 'rgba(7, 27, 19, 0.8)',
                    border: formErrors.address ? '1.5px solid var(--color-danger)' : '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                {formErrors.address && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-danger)', marginTop: '0.25rem', display: 'block' }}>
                    {formErrors.address}
                  </span>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  ملاحظات خاصة بالتسليم (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أي تعليمات للمندوب بخصوص موعد التسليم المفضل..."
                  style={{
                    width: '100%',
                    background: 'rgba(7, 27, 19, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.65rem 1rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} color="var(--gold-400)" />
                  <span>2. طريقة الدفع</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Cash On Delivery (Selected by default) */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: formData.paymentMethod === 'cod' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(7, 27, 19, 0.6)',
                      border: formData.paymentMethod === 'cod' ? '1.5px solid var(--gold-500)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem 1.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      style={{ accentColor: 'var(--gold-500)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>الدفع عند الاستلام (COD)</span>
                        <span className="badge-gold" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>الخيار الأفضل والمضمون</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: '3px' }}>
                        ادفعي نقداً لمندوب الشحن بعد استلام ومعاينة القطع والتأكد من مطابقتها.
                      </p>
                    </div>
                  </label>

                  {/* Online Payment Card (Architecture Prepared) */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: formData.paymentMethod === 'card' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(7, 27, 19, 0.6)',
                      border: formData.paymentMethod === 'card' ? '1.5px solid var(--gold-500)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem 1.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      style={{ accentColor: 'var(--gold-500)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CreditCard size={18} color="var(--gold-400)" />
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>بطاقة بنكية (فيزا / ماستركارد / ميزة)</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: '3px' }}>
                        بوابة دفع بنكية مشفرة وآمنة وفق معايير PCI-DSS العالمية.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.05rem',
                  marginTop: '1.5rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? (
                  <span>جاري تأكيد وتسجيل الطلب...</span>
                ) : (
                  <>
                    <span>تأكيد الطلب وشحن المنتجات</span>
                    <CheckCircle2 size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Summary Column */}
          <div
            style={{
              background: 'rgba(17, 51, 36, 0.55)',
              border: '1.5px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              position: 'sticky',
              top: '100px'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              محتويات طلبكِ ({cart.length})
            </h3>

            <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0 }}>
                      {item.product.name}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      مقاس: {item.selectedSize} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-editorial" style={{ fontSize: '0.92rem', color: 'var(--gold-300)', fontWeight: 700 }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>المجموع الفرعي:</span>
                <span className="font-editorial">{formatPrice(cartSubtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>تكلفة الشحن:</span>
                <span>{isFreeShipping ? <strong style={{ color: 'var(--color-success)' }}>شحن مجاني</strong> : formatPrice(shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-medium)', fontSize: '1.2rem', fontWeight: 800 }}>
                <span style={{ color: '#ffffff' }}>الإجمالي المستحق:</span>
                <span className="font-editorial text-gold-300">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: 'rgba(7, 27, 19, 0.7)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={18} color="var(--gold-400)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                حق المعاينة مكفول قبل السداد بالكامل
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
