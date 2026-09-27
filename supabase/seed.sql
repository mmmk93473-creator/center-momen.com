-- ====================================================================
-- MOMEN CENTER - SEED INITIAL DATA (CATEGORIES & PRODUCTS)
-- ====================================================================

-- Categories Seed
INSERT INTO public.categories (id, name, name_en, description, image, count, status)
VALUES
  ('dresses', 'فساتين', 'Dresses', 'تشكيلة ساحرة من فساتين السهرة والمناسبات والماكسي الحريري المصنوع بإتقان استثنائي.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop', 24, 'active'),
  ('blouses', 'بلوزات', 'Blouses & Tops', 'بلوزات وتوبات حريرية وأكمام منسدلة تجمع بين الرقي اليومي وفخامة التفاصيل.', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop', 18, 'active'),
  ('pants', 'بناطيل', 'Trousers & Pants', 'قصات بالازو واسعة وبناطيل كلاسيكية بأقمشة إيطالية تمنحك إطلالة مهيبة وراحة مطلقة.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop', 15, 'active'),
  ('jackets', 'جاكيتات', 'Jackets & Blazers', 'بليزرات ومعاطف شتوية وخريفية بقصات هوت كوتور تضفي هيبة ملكية على حضورك.', 'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?q=80&w=1000&auto=format&fit=crop', 12, 'active'),
  ('accessories', 'إكسسوارات', 'Luxury Accessories', 'حقائب جلدية فاخرة، أوشحة من الحرير الخالص، ومجوهرات مطلية بالذهب تكمل إطلالتك.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop', 9, 'active')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  description = EXCLUDED.description,
  image = EXCLUDED.image;

-- Sample Homepage Settings Seed
INSERT INTO public.homepage_settings (id, hero_badge, hero_title, hero_subtitle, hero_cta_text, announcement_text, announcement_active, featured_category_ids, show_trending_section)
VALUES (
  1,
  'تشكيلة صيف وخريف 2026 الحصرية',
  'فخامة لا تشبه إلا حضورك الملكي',
  'دار أزياء نسائية سعودية رفيعة المستوى، تصاميم هوت كوتور تنسدل بأنوثة حالمة وأقمشة حريرية إيطالية نادرة.',
  'اكتشفي المجموعة الفاخرة',
  'توصيل مجاني لجميع مناطق المملكة للطلبات فوق 500 ريال | هدايا حصرية مع كل طلب',
  true,
  '["dresses", "blouses", "jackets", "accessories"]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Sample Offers Seed
INSERT INTO public.offers (id, code, title, discount_percent, min_order_amount, start_date, end_date, is_active, usage_count)
VALUES
  ('offer-momen10', 'MOMEN10', 'خصم الترحيب بالأعضاء الجدد', 10, 1000, '2026-01-01', '2026-12-31', true, 48),
  ('offer-vip15', 'VIP15', 'عرض النخبة لتشكيلة الصيف', 15, 3000, '2026-06-01', '2026-09-30', true, 22)
ON CONFLICT (id) DO NOTHING;
