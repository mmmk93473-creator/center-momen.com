import type { Category } from '../types/product';

export const categories: Category[] = [
  {
    id: 'dresses',
    name: 'فساتين',
    nameEn: 'Dresses',
    description: 'تشكيلة ساحرة من فساتين السهرة والمناسبات والماكسي الحريري المصنوع بإتقان استثنائي.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop',
    count: 24,
  },
  {
    id: 'blouses',
    name: 'بلوزات',
    nameEn: 'Blouses & Tops',
    description: 'بلوزات وتوبات حريرية وأكمام منسدلة تجمع بين الرقي اليومي وفخامة التفاصيل.',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop',
    count: 18,
  },
  {
    id: 'pants',
    name: 'بناطيل',
    nameEn: 'Trousers & Pants',
    description: 'قصات بالازو واسعة وبناطيل كلاسيكية بأقمشة إيطالية تمنحك إطلالة مهيبة وراحة مطلقة.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    count: 15,
  },
  {
    id: 'jackets',
    name: 'جاكيتات',
    nameEn: 'Jackets & Blazers',
    description: 'بليزرات ومعاطف شتوية وخريفية بقصات هوت كوتور تضفي هيبة ملكية على حضورك.',
    image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?q=80&w=1000&auto=format&fit=crop',
    count: 12,
  },
  {
    id: 'accessories',
    name: 'إكسسوارات',
    nameEn: 'Luxury Accessories',
    description: 'حقائب جلدية فاخرة، أوشحة من الحرير الخالص، ومجوهرات مطلية بالذهب تكمل إطلالتك.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    count: 20,
  }
];
