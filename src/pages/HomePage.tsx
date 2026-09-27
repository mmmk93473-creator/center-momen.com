import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { HeroFrameSequence } from '../components/hero/HeroFrameSequence';
import { ShopByCategory } from '../components/sections/ShopByCategory';
import { NewArrivals } from '../components/sections/NewArrivals';
import { TrendingNow } from '../components/sections/TrendingNow';
import { SeasonalCollection } from '../components/sections/SeasonalCollection';
import { BestSellers } from '../components/sections/BestSellers';
import { SpecialOffers } from '../components/sections/SpecialOffers';
import { WhyMomenCenter } from '../components/sections/WhyMomenCenter';
import { FashionGallery } from '../components/sections/FashionGallery';
import { Newsletter } from '../components/sections/Newsletter';

export const HomePage: React.FC = () => {
  const scrollToNextSection = () => {
    const el = document.getElementById('shop-by-category');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEOHead
        title="أناقتك تبدأ من هنا | دار الأزياء النسائية الفاخرة"
        description="تسوقي أحدث صيحات الموضة النسائية وتصاميم الهوت كوتور الراقية من مؤمن سنتر (Momen Center). فساتين حريرية، بلوزات، أطقم وبليزرات فاخرة بجودة استثنائية."
      />

      {/* 1. Cinematic Scroll Hero Frame Sequence */}
      <HeroFrameSequence onScrollToNext={scrollToNextSection} />

      {/* 2. Shop By Category */}
      <ShopByCategory />

      {/* 3. New Arrivals */}
      <NewArrivals />

      {/* 4. Trending Now */}
      <TrendingNow />

      {/* 5. Seasonal Collection (Royal Emerald Spotlight) */}
      <SeasonalCollection />

      {/* 6. Best Sellers */}
      <BestSellers />

      {/* 7. Special Offers */}
      <SpecialOffers />

      {/* 8. Why Momen Center */}
      <WhyMomenCenter />

      {/* 9. Fashion Gallery (Lookbook) */}
      <FashionGallery />

      {/* 10. Newsletter VIP Club */}
      <Newsletter />
    </>
  );
};
