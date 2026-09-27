import type { Product } from '../types/product';

export const products: Product[] = [
  {
    id: 'momen-emerald-dress-01',
    name: 'فستان الزمرد الملكي الحريري',
    nameEn: 'The Royal Emerald Silk Gown',
    category: 'dresses',
    price: 3850,
    oldPrice: 4600,
    discount: 16,
    images: [
      '/hero-frames/frame_240.webp',
      '/hero-frames/frame_180.webp',
      '/hero-frames/frame_120.webp',
      '/hero-frames/frame_001.webp'
    ],
    description: 'تحفة مؤمن سنتر الأيقونية. فستان ماكسي مصمم من أفخر أنواع الحرير المنسدل بلون المريمية الزيتوني الملكي، مع حزام خصر رقيق يبرز أنوثتك وياقة دائرية كلاسيكية مع أكمام فضفاضة مطاطية.',
    fabric: 'حرير ساتان طبيعي 100% مع بطانة ناعمة مضادة للحساسية',
    care: 'تنظيف جاف فقط (Dry Clean Only) للحفاظ على بريق ولمعان الحرير',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'ميرمية زيتوني', hex: '#8a9e8c' },
      { name: 'زمردي داكن', hex: '#113324' },
      { name: 'ذهبي شامبين', hex: '#d4af37' }
    ],
    rating: 4.95,
    reviews: 142,
    stock: 18,
    featured: true,
    newArrival: true,
    bestSeller: true,
    trending: true,
    season: 'ربيع وصيف 2026'
  },
  {
    id: 'dresses-02',
    name: 'فستان السهرة المخملي الأسود المرصع',
    nameEn: 'Embellished Black Velvet Evening Gown',
    category: 'dresses',
    price: 4400,
    oldPrice: 5200,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'إطلالة درامية مفعمة بالفخامة والوقار. مخمل حريري أسود داكن منسوج بتطريزات ذهبية ناعمة عند المعصم، مثالي لأمسياتك ومناسباتك الراقية.',
    fabric: 'مخمل إيطالي فاخر 100%',
    care: 'تنظيف جاف حصراً',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'أسود ملكي', hex: '#111111' },
      { name: 'كحلي نايت سكاي', hex: '#0f172a' }
    ],
    rating: 4.9,
    reviews: 86,
    stock: 9,
    featured: true,
    bestSeller: true,
    trending: true,
    season: 'خريف وشتاء 2026'
  },
  {
    id: 'dresses-03',
    name: 'قفطان الحرير المطرز بالخيوط الذهبية',
    nameEn: 'Gold-Threaded Silk Kaftan',
    category: 'dresses',
    price: 4950,
    oldPrice: 5800,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1612465289139-30cbb577db6d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'قفطان فخم مستوحى من الأصالة التراثية بلمسة معاصرة، منقوش يدوياً بخيوط القصب الذهبية الصافية ومزين بأزرار حريرية مشغولة يدوياً.',
    fabric: 'كريب حرير نقي مع تطريز قصب مذهب',
    care: 'تنظيف جاف متخصص',
    sizes: ['Free Size (مناسب لجميع المقاسات)'],
    colors: [
      { name: 'أبيض عاجي', hex: '#fdfbf7' },
      { name: 'أخضر زمردي', hex: '#0d3b2b' }
    ],
    rating: 4.98,
    reviews: 110,
    stock: 7,
    featured: true,
    newArrival: true,
    bestSeller: false,
    trending: true
  },
  {
    id: 'dresses-04',
    name: 'فستان شيفون بليسيه وردي رقيق',
    nameEn: 'Dusty Rose Pleated Chiffon Dress',
    category: 'dresses',
    price: 3100,
    oldPrice: 3600,
    discount: 14,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'تصميم شاعري يتميز بكسرات بليسيه دقيقة تتهادى مع كل خطوة، مع أكمام شفافة خفيفة وتحديد ناعم للخصر.',
    fabric: 'شيفون حريري مصفى مع بطانة قطن فوال',
    care: 'غسيل يدوي بماء بارد أو تنظيف جاف',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'وردي غباري', hex: '#dcae96' },
      { name: 'بيج نود', hex: '#e8dccb' }
    ],
    rating: 4.85,
    reviews: 64,
    stock: 14,
    featured: false,
    newArrival: true,
    bestSeller: false
  },
  {
    id: 'blouses-01',
    name: 'بلوزة ساتان بيور بياقة كشكش فيونكة',
    nameEn: 'Pussy-Bow Silk Satin Blouse',
    category: 'blouses',
    price: 1850,
    oldPrice: 2200,
    discount: 16,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'بلوزة استثنائية تناسب إطلالات العمل الراقية واللقاءات المسائية. ربطة عنق درامية وأكمام واسعة تنتهي بأساور مزينة بأزرار لؤلؤية.',
    fabric: 'ساتان حريري مقاوم للتجعد',
    care: 'غسيل رقيق أو تنظيف جاف',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'أوف وايت', hex: '#f9f6f0' },
      { name: 'زمردي عميق', hex: '#113324' },
      { name: 'كحلي داكن', hex: '#1e293b' }
    ],
    rating: 4.88,
    reviews: 73,
    stock: 22,
    featured: true,
    newArrival: true,
    bestSeller: true
  },
  {
    id: 'blouses-02',
    name: 'تونيك كتان مطرز بالأكمام المنفوخة',
    nameEn: 'Embroidered Linen Balloon Sleeve Tunic',
    category: 'blouses',
    price: 1950,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'تونيك صيفي راقٍ من الكتان الطبيعي الفاخر، مزين بتطريزات هندسية تمنحك إحساساً بالانتعاش والوقار في آن واحد.',
    fabric: 'كتان هولندي طبيعي 100%',
    care: 'غسيل في الغسالة ببرنامج أقمشة ناعمة',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'بيج رملي', hex: '#dfd7c5' },
      { name: 'أبيض ناصع', hex: '#ffffff' }
    ],
    rating: 4.82,
    reviews: 41,
    stock: 12,
    newArrival: true
  },
  {
    id: 'blouses-03',
    name: 'قميص حرير دكستر مع أزرار صدفية',
    nameEn: 'Mother-of-Pearl Tailored Silk Shirt',
    category: 'blouses',
    price: 2100,
    oldPrice: 2500,
    discount: 16,
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'قميص بقصة مستقيمة ومتقنة مستوحاة من الأناقة الإيطالية، بأزرار صدف طبيعي تعكس الضوء ببريق خافت.',
    fabric: 'حرير كريب دو شين 100%',
    care: 'تنظيف جاف لطيف',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'أزرق سماوي باهت', hex: '#c5d8e8' },
      { name: 'عاجي دافئ', hex: '#f5eee1' }
    ],
    rating: 4.9,
    reviews: 55,
    stock: 16,
    bestSeller: true
  },
  {
    id: 'pants-01',
    name: 'بنطال بالازو واسع من الكريب الملكي',
    nameEn: 'Royal Crepe Wide-Leg Palazzo Pants',
    category: 'pants',
    price: 2200,
    oldPrice: 2600,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'قصة انسيابية ساحرة تمتد حتى الأرض وتمنح القوام طولاً ورشاقة مذهلة. خصر مرتفع مبطن مع جيوب مخفية أنيقة.',
    fabric: 'كريب إسباني ثقيل عالي الجودة',
    care: 'كي بالبخار وتنظيف جاف',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'أسود فحمي', hex: '#1c1c1c' },
      { name: 'أبيض عاجي', hex: '#f6f4ee' },
      { name: 'أخضر زمردي', hex: '#113324' }
    ],
    rating: 4.92,
    reviews: 95,
    stock: 25,
    featured: true,
    bestSeller: true,
    trending: true
  },
  {
    id: 'pants-02',
    name: 'بنطال سيكريت تيلورد بكسرات أمامية',
    nameEn: 'Pleated Tailored Cigarette Trousers',
    category: 'pants',
    price: 1950,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'قصة كلاسيكية مجسمة مع كسرات أمامية دقيقة، يتماشى مع البليزرات الرسمية والأحذية ذات الكعب العالي.',
    fabric: 'مزيج صوف فيسكوز خفيف الوزن',
    care: 'تنظيف جاف',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'رمادي ميلانج', hex: '#71717a' },
      { name: 'كحلي نيفي', hex: '#1e3a5f' }
    ],
    rating: 4.79,
    reviews: 38,
    stock: 19
  },
  {
    id: 'pants-03',
    name: 'بنطال كتان نقي برباط خصر مريح',
    nameEn: 'Pure Linen Drawstring Relaxed Trousers',
    category: 'pants',
    price: 1750,
    oldPrice: 2000,
    discount: 12,
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'خفة ونعومة لا تضاهى لأيام العطلات والإطلالات المريحة دون التخلي عن رقي المظهر العام.',
    fabric: 'كتان طبيعي 100%',
    care: 'غسيل بماء بارد',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'رملي صحراوي', hex: '#d9cdb8' },
      { name: 'زيتوني فاتح', hex: '#8a9a86' }
    ],
    rating: 4.84,
    reviews: 52,
    stock: 14,
    newArrival: true
  },
  {
    id: 'jackets-01',
    name: 'بليزر كوتور بتطريز ذهبي وحزام خصر',
    nameEn: 'Couture Blazer with Gold Embroidery',
    category: 'jackets',
    price: 3600,
    oldPrice: 4200,
    discount: 14,
    images: [
      'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'قطعة القوة والأناقة المطلقة. سترة مفصلة بأكتاف حادة وياقة شال مزينة بأشرطة مذهبة مع حزام قابل للتعديل.',
    fabric: 'كريب صوف بريطاني مع بطانة ساتان ناعم',
    care: 'تنظيف جاف حصراً',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'زمردي مؤمن سنتر الأيقوني', hex: '#0e2b1f' },
      { name: 'أسود أونيكس', hex: '#0a0a0a' }
    ],
    rating: 4.96,
    reviews: 104,
    stock: 11,
    featured: true,
    bestSeller: true,
    trending: true
  },
  {
    id: 'jackets-02',
    name: 'معطف ترنش صيفي حريري طويل',
    nameEn: 'Long Draped Silk Trench Coat',
    category: 'jackets',
    price: 4200,
    oldPrice: 4800,
    discount: 12,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'معطف طويل خفيف الوزن يتهادى مع حركتك بانسيابية بالغة. أزرار كبس مخفية وجيوب عميقة أنيقة.',
    fabric: 'كوبرا حريري عالي الجودة ومقاوم للرياح الخفيفة',
    care: 'تنظيف جاف',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'بيج تاتل', hex: '#ded4c3' },
      { name: 'أخضر مريمية', hex: '#8a9e8c' }
    ],
    rating: 4.89,
    reviews: 67,
    stock: 8,
    newArrival: true
  },
  {
    id: 'jackets-03',
    name: 'كاب مسائي فاخر بحواف الفرو الصناعي',
    nameEn: 'Luxe Evening Cape with Faux-Fur Trim',
    category: 'jackets',
    price: 3900,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'لمسة إضافية تفيض دفئاً وأناقة فوق فساتين السهرة الرسمية في ليالي الشتاء والمناسبات الخاصة.',
    fabric: 'صوف كشمير ناعم مع فرو فيجان فاخر',
    care: 'تنظيف جاف بالبخار',
    sizes: ['One Size (مقاس موحد)'],
    colors: [
      { name: 'أسود ملكي', hex: '#111111' },
      { name: 'عنابي بورغندي', hex: '#581845' }
    ],
    rating: 4.93,
    reviews: 49,
    stock: 6,
    featured: false
  },
  {
    id: 'accessories-01',
    name: 'حقيبة يد جلدية محفورة بشعار Mo\'men Center',
    nameEn: 'Mo\'men Center Monogram Leather Tote',
    category: 'accessories',
    price: 2750,
    oldPrice: 3200,
    discount: 14,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'حقيبة فاخرة من الجلد الطبيعي المحبب باللون الأخضر الزمردي الغني ومزينة بحلية معدنية ذهبية مطلية عيار 24 لشعار MC الأيقوني.',
    fabric: 'جلد عجل إيطالي طبيعي 100% مع بطانة مخملية',
    care: 'تنظيف بقطعة قماش ناعمة وملمع جلود مخصص',
    sizes: ['مقاس متوسط (32×24 سم)'],
    colors: [
      { name: 'أخضر زمردي', hex: '#0e2b1f' },
      { name: 'أسود كلاسيك', hex: '#1a1a1a' },
      { name: 'عسلي دافئ', hex: '#b36b22' }
    ],
    rating: 4.97,
    reviews: 130,
    stock: 15,
    featured: true,
    bestSeller: true,
    trending: true
  },
  {
    id: 'accessories-02',
    name: 'وشاح حرير خالص برسمة نباتية ذهبية',
    nameEn: 'Hand-Rolled Pure Silk Twill Scarf',
    category: 'accessories',
    price: 950,
    oldPrice: 1200,
    discount: 20,
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'وشاح حريري مربع 90×90 سم بحواف ملفوفة ومخيطة يدوياً، بتدرجات الزمرّد والذهب العتيق تضفي رقة وفخامة على حجابك أو عنقك.',
    fabric: 'حرير تويل طبيعي 100%',
    care: 'غسيل يدوي بماء بارد ومنظف حرير خاص',
    sizes: ['90 × 90 سم'],
    colors: [
      { name: 'زمردي مع ذهبي', hex: '#113324' },
      { name: 'كحلي مع شامبين', hex: '#1e3a5f' }
    ],
    rating: 4.94,
    reviews: 88,
    stock: 30,
    newArrival: true,
    bestSeller: true
  },
  {
    id: 'accessories-03',
    name: 'حزام خصر معدني مطلي بالذهب بشعار الدار',
    nameEn: 'Gold Plated Signature Emblem Waist Belt',
    category: 'accessories',
    price: 850,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'إكسسوار الخصر المثالي لتحويل أي فستان أو سترة إلى إطلالة هوت كوتور مبهرة. قفل مغناطيسي خفي ومريح.',
    fabric: 'نحاس مصقول مطلي بطبقة ذهب عيار 18 مقاوم لتغير اللون',
    care: 'يحفظ في كيس المخمل المرفق بعيداً عن العطور',
    sizes: ['قابل للتعديل (S إلى XXL)'],
    colors: [
      { name: 'ذهب أصفر لامع', hex: '#d4af37' },
      { name: 'ذهب عتيق مطفي', hex: '#b38c23' }
    ],
    rating: 4.88,
    reviews: 62,
    stock: 24,
    trending: true
  },
  {
    id: 'dresses-05',
    name: 'فستان ميدي بليسيه بقصة غير متماثلة',
    nameEn: 'Asymmetric Pleated Midi Dress',
    category: 'dresses',
    price: 3300,
    oldPrice: 3800,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'قصة عصرية غير متماثلة تفيض بالحيوية، مثالية لحفلات الكوكتيل واللقاءات الراقية مع أحذية بكعب مدبب.',
    fabric: 'حرير كريب خفيف بليسيه',
    care: 'تنظيف جاف',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'زمردي زمردي', hex: '#164e37' },
      { name: 'أرجواني ملكي', hex: '#4c1d95' }
    ],
    rating: 4.81,
    reviews: 35,
    stock: 10
  },
  {
    id: 'blouses-04',
    name: 'بلوزة كريب فرنسي مع أكمام درابيه',
    nameEn: 'French Crepe Draped Sleeve Blouse',
    category: 'blouses',
    price: 1700,
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'أكمام درابيه منسدلة بلطف تمنح حركة مريحة وجذابة، مع خامة لا تحتاج للكي المتكرر وسهلة العناية.',
    fabric: 'كريب فرنسي عالي النعومة',
    care: 'غسيل لطيف',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'أبيض لؤلؤي', hex: '#f8fafc' },
      { name: 'رمادي حجري', hex: '#94a3b8' }
    ],
    rating: 4.77,
    reviews: 29,
    stock: 18
  },
  {
    id: 'pants-04',
    name: 'بنطال حرير مستقيم مع فتحات جانبية خفية',
    nameEn: 'Straight-Leg Silk Trousers with Ankle Slits',
    category: 'pants',
    price: 2350,
    oldPrice: 2800,
    discount: 16,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'تفاصيل فتحات الكاحل الخفية تضيف لمسة من الجاذبية عند الحركة، مع نسيج حريري ناعم الملمس يداعب البشرة.',
    fabric: 'ساتان حريري مغزول بعناية',
    care: 'تنظيف جاف فقط',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'زيتوني مطفي', hex: '#637361' },
      { name: 'أسود عميق', hex: '#0f0f0f' }
    ],
    rating: 4.91,
    reviews: 48,
    stock: 12
  },
  {
    id: 'jackets-04',
    name: 'جاكيت تويد بياقة دائرية وأزرار لؤلؤية',
    nameEn: 'Classic Tweed Jacket with Pearl Buttons',
    category: 'jackets',
    price: 3450,
    oldPrice: 4000,
    discount: 14,
    images: [
      'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'إشادة بتراث الأزياء الباريسية الكلاسيكية. نسيج تويد غني بتداخل خيوط الذهب والزمرد مع أزرار لؤلؤ محاطة بإطار ذهبي.',
    fabric: 'تويد فرنسي فاخر مع خيوط ميتاليك دقيقة',
    care: 'تنظيف جاف بالبخار',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'أخضر وذهب مع كريمي', hex: '#1f4e38' },
      { name: 'كحلي مع فضي', hex: '#1e293b' }
    ],
    rating: 4.95,
    reviews: 79,
    stock: 10,
    bestSeller: true,
    trending: true
  },
  {
    id: 'accessories-04',
    name: 'محفظة سهرة كلاتش مرصعة بالكريستال الأخضر',
    nameEn: 'Emerald Crystal Evening Clutch',
    category: 'accessories',
    price: 1850,
    oldPrice: 2200,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'حقيبة كلاتش مدمجة للمناسبات السعيدة مع سلسلة كتف ذهبية قابلة للفصل وإغلاق محكم بكريستالة زمردية مشطوفة.',
    fabric: 'مخمل مطعم بأحجار كريستال برّاقة وسلسلة مذهبة',
    care: 'تنظيف بمسح لطيف وحفظ في علبتها الخاصة',
    sizes: ['20 × 12 × 5 سم'],
    colors: [
      { name: 'أخضر زمردي كريستالي', hex: '#0a3d2e' },
      { name: 'ذهبي شامبين', hex: '#d4af37' }
    ],
    rating: 4.87,
    reviews: 43,
    stock: 14
  }
];
